'use client';

import { getErrorMessage } from '@/utils/errorMessage';
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map as MapType, Share, RelevantId } from '@/types/common/index';
import { userApi, shareApi } from '@/api'; // Assuming these are correctly imported and structured
import { useNotification } from '@/contexts/notification/NotificationContext';
import {
  itemFadeSlideDownVariants,
  listContainerStaggerVariants,
  listItemSlideFadeInVariants,
  buttonHoverTapVariants,
} from '@/lib/animations';

type ShareMapPanelProps = {
  map: MapType;
  share: Share; // Parent (ShareSettingPanel) now ensures this is valid
};

// Icon Components (ensure these are defined or imported correctly)
const LockClosedIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 00-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);
const UsersIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);
const GlobeAltIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A11.978 11.978 0 0112 16.5c-2.998 0-5.74-1.1-7.843-2.918m15.686-5.25A8.959 8.959 0 003 12c0 .778.099 1.533.284 2.253m0 0A11.978 11.978 0 0012 16.5c2.998 0 5.74-1.1 7.843-2.918" />
  </svg>
);
const ClipboardCopyIcon = ({ className = "h-4 w-4 mr-1.5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a2.25 2.25 0 01-2.25 2.25h-1.5a2.25 2.25 0 01-2.25-2.25V4.5m7.332 0l-1.32.632A4.5 4.5 0 019.75 8.25h-3a4.5 4.5 0 01-3.455-1.584l-1.32-.632m16.5 0c0 1.842-.928 3.464-2.251 4.532A48.048 48.048 0 0112 11.25c-2.646 0-5.188-.252-7.499-.732A4.492 4.492 0 012.25 4.5m16.5 0a2.25 2.25 0 00-2.25-2.25H4.5a2.25 2.25 0 00-2.25 2.25m16.5 0v9c0 .621-.504 1.125-1.125 1.125H3.375A1.125 1.125 0 012.25 13.5v-9" /></svg>
);
const CheckIcon = ({ className = "h-4 w-4 mr-1.5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
);
const SaveIcon = ({ className = "h-5 w-5 mr-2" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const UserRemoveIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" /></svg>
);

export default function ShareMapPanel({ map, share }: ShareMapPanelProps) {
  const [accessScope, setAccessScope] = useState<'private' | 'assigned' | 'anyone'>(share.access.range || 'private');
  const [relevantUsers, setRelevantUsers] = useState<RelevantId[]>([]);
  const shareLink = useMemo(() =>
    `${typeof window !== 'undefined' ? window.location.origin : ''}/m/${share.code ?? ''}`,
    [share.code]
  );

  const [copied, setCopied] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'viewer' | 'editor'>('viewer');

  const { showNotification } = useNotification();

  useEffect(() => {
    if (share && share.access) {
      setAccessScope(share.access.range || 'private');
      const initialUsers = share.access.relevant_ids?.map(u => ({
        ...u,
      })) || [];
      setRelevantUsers(initialUsers);
    }
  }, [share]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(shareLink)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy link: ', err);
        showNotification('Failed to copy link.', 'error');
      });
  }, [shareLink, showNotification]);

  const handleRemoveUser = useCallback((id: string) => {
    setRelevantUsers(prev => prev.filter(user => user.id !== id));
    showNotification('User access removed. Save to apply changes.', 'info');
  }, [showNotification]);

  const handleInvite = useCallback(async () => {
    if (!inviteEmail.trim()) {
      showNotification('Please enter an email address.', 'warning');
      return;
    }
    try {
      const data = await userApi.getUserByEmail(inviteEmail);

      if (!data || !data.user) {
        showNotification(`User with email "${inviteEmail}" not found.`, 'error');
        return;
      }

      if (relevantUsers.find(existingUser => existingUser.id === data.user.id)) {
        showNotification('User already has access to this map.', 'warning');
        return;
      }

      if (map.owner === data.user.id) {
        showNotification('You cannot invite yourself to the map.', 'info');
        return;
      }

      const newRelevantUser: RelevantId = {
        id: data.user.id,
        permission: inviteRole === 'editor' ? 'write' : 'read',
        user: data.user,
      };

      setRelevantUsers(prevUsers => [...prevUsers, newRelevantUser]);
      setInviteEmail('');
      showNotification(`${data.user.username || data.user.email} invited. Save to apply changes.`, 'success');

    } catch (error) {
      console.error(`Failed to fetch user for email: ${inviteEmail}`, error);
      const message = getErrorMessage(error, `Failed to invite user "${inviteEmail}".`);
      showNotification(message, 'error');
    }
  }, [inviteEmail, inviteRole, relevantUsers, map, showNotification]); // Removed userApi from deps as it should be stable

  const handleSave = useCallback(async () => {
    try {
      await shareApi.updateMapSharing(map.id, {
        range: accessScope,
        relevant_ids: relevantUsers.map(user => ({
          id: user.id,
          permission: user.permission,
        })),
      });
      showNotification('Sharing settings saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving sharing settings:', error);
      const message = getErrorMessage(error, 'Failed to save settings.');
      showNotification(message, 'error');
    }
  }, [map.id, accessScope, relevantUsers, showNotification]); // Removed shareApi from deps

  const accessOptions = [
    { value: 'private', label: 'Private', Icon: LockClosedIcon, description: "Only you can access this map." },
    { value: 'assigned', label: 'Specific People', Icon: UsersIcon, description: "Only explicitly invited people can access." },
    { value: 'anyone', label: 'Anyone with Link', Icon: GlobeAltIcon, description: "Anyone with the link can view the map." },
  ];

  return (
    <motion.div
      className="space-y-6 text-slate-200 py-1"
      variants={listContainerStaggerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.h3
        className="text-lg font-semibold text-indigo-300 flex items-center"
        variants={itemFadeSlideDownVariants}
      >
        Share Access Settings
      </motion.h3>

      <motion.div variants={itemFadeSlideDownVariants} className="space-y-2">
        <p className="text-sm font-medium text-slate-300 mb-2.5">Who can access this map?</p>
        <div className="space-y-3">
          {accessOptions.map(({ value, label, Icon, description }) => (
            <motion.label
              key={value}
              variants={listItemSlideFadeInVariants}
              whileHover={{ backgroundColor: "rgba(71, 85, 105, 0.5)" }}
              className={`flex items-start p-3.5 rounded-lg border-2 transition-all cursor-pointer
                ${accessScope === value
                  ? 'bg-slate-700/80 border-indigo-500 ring-2 ring-indigo-500/70'
                  : 'bg-slate-800/60 border-slate-600 hover:border-slate-500'
                }`}
            >
              <input
                type="radio"
                name="accessScope"
                value={value}
                checked={accessScope === value}
                onChange={() => setAccessScope(value as 'private' | 'assigned' | 'anyone')}
                className="h-5 w-5 mt-0.5 text-indigo-500 bg-slate-600 border-slate-500 focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-800 accent-indigo-500 flex-shrink-0"
              />
              <span className="ml-3 flex flex-col">
                <span className="text-sm font-semibold text-slate-100 flex items-center">
                  <Icon className={`h-5 w-5 mr-2 ${accessScope === value ? 'text-indigo-400' : 'text-slate-400'}`} />
                  {label}
                </span>
                <span className="text-xs text-slate-400 mt-1">{description}</span>
              </span>
            </motion.label>
          ))}
        </div>
      </motion.div>
      <AnimatePresence mode="wait">
        {accessScope !== 'private' && (
          <motion.div
            key="sharing-details-active-section"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: '1.5rem', paddingTop: '1.5rem', borderTopWidth: '1px' }}
            exit={{ opacity: 0, height: 0, marginTop: '0rem', paddingTop: '0rem', borderTopWidth: '0px', transition: { duration: 0.2 } }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="space-y-6 border-slate-700/60"
          >
            {/* Invite by Email Section - Only for 'assigned' */}
            <motion.div
              variants={itemFadeSlideDownVariants}
              initial="hidden" // Ensure this variant exists in itemFadeSlideDownVariants
              animate="visible" // Ensure this variant exists in itemFadeSlideDownVariants
            // exit="exit" // Optional: if you want it to animate out individually
            >
              <label htmlFor="invite-email-input" className="block text-sm font-medium text-slate-200 mb-1.5">Invite by Email</label>
              <textarea
                id="invite-email-input"
                rows={2} // Consider changing to 1 if only one email is expected, as discussed for simplification
                placeholder="Enter one email address..."
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full text-sm p-2.5 bg-slate-700 border-2 border-slate-600 text-slate-100 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-400 shadow-sm transition-colors duration-150 ease-in-out"
              />
              <div className="mt-2.5 flex items-center space-x-3">
                <label htmlFor="invite-role-select" className="text-sm font-medium text-slate-200">As:</label>
                <select
                  id="invite-role-select"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'viewer' | 'editor')}
                  className="text-sm p-2.5 border-2 border-slate-600 bg-slate-700 text-slate-100 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm appearance-none pr-8"
                >
                  <option value="viewer" className="bg-slate-700 text-slate-100">Viewer</option>
                  <option value="editor" className="bg-slate-700 text-slate-100">Editor</option>
                </select>
                <motion.button
                  {...buttonHoverTapVariants}
                  onClick={handleInvite}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-md hover:bg-indigo-500 transition-colors shadow"
                >
                  Send Invite
                </motion.button>
              </div>
            </motion.div>


            {/* People with Access List - Only for 'assigned' */}
            {relevantUsers.length > 0 ? (
              <motion.div
                variants={itemFadeSlideDownVariants}
                initial="hidden" // Ensure this variant exists
                animate="visible" // Ensure this variant exists
                className="pt-1"
              >
                <p className="text-sm font-medium text-slate-200 mb-2">People with Access:</p>
                <motion.ul
                  className="max-h-48 overflow-y-auto space-y-2 pr-1 -mr-1 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800/50 rounded-md"
                  variants={listContainerStaggerVariants}
                  initial="hidden" // This applies to children of the ul if they also use these variant names
                  animate="visible"
                >
                  {relevantUsers.map(user => (
                    <motion.li
                      key={user.id}
                      variants={listItemSlideFadeInVariants} // These variants are for list items within the staggering parent
                      // No need for initial/animate here if listContainerStaggerVariants handles propagation
                      className="flex items-center justify-between text-sm border border-slate-700 rounded-lg px-3 py-2.5 bg-slate-800 hover:bg-slate-700/70 transition-colors shadow-sm"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ring-1 ring-slate-600 overflow-hidden">
                          {user.user?.username?.charAt(0).toUpperCase() || user.user?.email?.charAt(0).toUpperCase() || (user.id ? user.id.charAt(0).toUpperCase() : '?')}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-slate-100 truncate" title={user.user?.username || user.user?.email || 'User'}>{user.user?.username || user.user?.email || 'Invited User'}</p>
                          <p className="text-slate-400 text-xs truncate" title={user.user?.email || ''}>{user.user?.email || (user.user?.username === 'Loading...' ? '...' : 'No email provided')}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 flex-shrink-0 ml-2">
                        <span className="text-slate-300 text-xs capitalize bg-slate-700 px-2 py-0.5 rounded-full">
                          {user.permission === 'write' ? 'Editor' : 'Viewer'}
                        </span>
                        {map.owner !== user.id && (
                          <motion.button
                            {...buttonHoverTapVariants}
                            onClick={() => handleRemoveUser(user.id)}
                            className="text-red-500 hover:text-red-400 p-1 rounded-full hover:bg-red-500/10 transition-colors"
                            aria-label={`Remove ${user.user?.username || 'user'}`}
                          >
                            <UserRemoveIcon className="h-5 w-5" />
                          </motion.button>
                        )}
                        {map.owner === user.id && (
                          <span className="text-xs text-indigo-400 px-2">(Owner)</span>
                        )}
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            ) : (<motion.p
              variants={itemFadeSlideDownVariants}
              initial="hidden" // Ensure this variant exists
              animate="visible" // Ensure this variant exists
              className="text-sm text-slate-500 italic pt-1"
            >
              No specific people have been invited yet for this map.
            </motion.p>
            )
            }

            {share.code && (
              <motion.div
                variants={itemFadeSlideDownVariants}
                initial="hidden" // Ensure this variant exists
                animate="visible" // Ensure this variant exists
                className="pt-1"
              >
                <label htmlFor="shareable-link-input" className="text-sm font-medium text-slate-200 mb-1.5 block">Anyone with this link can view:</label>
                <div className="flex items-center space-x-2">
                  <input
                    id="shareable-link-input"
                    type="text"
                    readOnly
                    value={shareLink}
                    className="w-full text-sm p-2.5 bg-slate-700 border-2 border-slate-600 text-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-400 shadow-sm"
                    onFocus={(e) => e.target.select()}
                  />
                  <motion.button
                    {...buttonHoverTapVariants}
                    onClick={handleCopy}
                    className={`px-3 py-2.5 rounded-md text-sm font-semibold transition-colors shadow flex items-center whitespace-nowrap ${copied
                      ? 'bg-green-600 hover:bg-green-500 text-white'
                      : 'bg-slate-600 hover:bg-slate-500 text-white'
                      }`}
                    aria-label={copied ? 'Link copied' : 'Copy shareable link'}
                  >
                    {copied ? <CheckIcon className="h-4 w-4 mr-1.5" /> : <ClipboardCopyIcon className="h-4 w-4 mr-1.5" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={itemFadeSlideDownVariants} className="pt-5 border-t border-slate-700/60 mt-6">
        <motion.button
          {...buttonHoverTapVariants}
          onClick={handleSave}
          className="w-full px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors shadow-md hover:shadow-lg flex items-center justify-center"
        >
          <SaveIcon />
          Save Sharing Settings
        </motion.button>
      </motion.div>

      <motion.p variants={itemFadeSlideDownVariants} className="text-xs text-slate-500 pt-2 text-center">
        Changes are applied when you click &quot;Save Sharing Settings&quot;.
      </motion.p>
    </motion.div>
  );
}