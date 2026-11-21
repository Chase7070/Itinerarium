import React from "react";
import Link from "next/link";

const Introduction = () => {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-16 max-w-3xl mx-auto">
                <h2 className="text-4xl sm:text-5xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-800 to-blue-600 dark:from-indigo-400 dark:to-blue-300">
                    Modern Map Travel Journal
                </h2>
                <p className="text-xl text-center text-gray-600 dark:text-gray-300">
                    Easily manage your travels, allowing friends and family to track your journey
                </p>
            </div>

                {/* feature block 1: your exclusive website */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
                <div className="md:col-span-7 rounded-2xl overflow-hidden shadow-xl transform transition-all hover:scale-[1.02] duration-500 group">
                    <img
                        src="/assets/home/mapDisplay1.jpeg"
                        alt="Your Personal Website"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="md:col-span-5 flex flex-col justify-center">
                    <div className="p-1 mb-4 w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                        </svg>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                        Your Personal Website
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                        Create a free account to store all your maps. Share links with anyone, and they can follow your journey without registering.
                    </p>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Set password protection for your blog to make it a private space.
                    </p>
                </div>
            </div>

            {/* feature block 2: homepage map */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
                <div className="md:col-span-5 md:order-1 order-2 flex flex-col justify-center">
                    <div className="p-1 mb-4 w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                        Homepage Map Display
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                        The best way to let visitors intuitively understand your travel routes is to show them:
                    </p>
                    <ul className="space-y-2">
                        {["Your current location", "Places you've been", "Places you plan to visit", "Transportation methods you use"].map((item, index) => (
                            <li key={index} className="flex items-start">
                                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-yellow-400 flex items-center justify-center text-indigo-900 font-bold mr-2">
                                    ✓
                                </span>
                                <span className="text-gray-600 dark:text-gray-300">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="md:col-span-7 md:order-2 order-1 rounded-2xl overflow-hidden shadow-xl transform transition-all hover:scale-[1.02] duration-500 group">
                    <img
                        src="/assets/home/mapDisplay2.webp"
                        alt="Homepage Map"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* feature block 3: collaborative map editing */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                <div className="md:col-span-7 rounded-2xl overflow-hidden shadow-xl transform transition-all hover:scale-[1.02] duration-500 group">
                    <img
                        src="/assets/home/mapDisplay3.webp"
                        alt="Collaborative Map Editing"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="md:col-span-5 flex flex-col justify-center">
                    <div className="p-1 mb-4 w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                        Collaborative Map Editing
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                        Collaborate with friends and family to edit and share your maps, creating a shared travel experience.
                    </p>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                        Build wonderful memories together by marking places you've visited as a team.
                    </p>
                    <Link href="/register" className="inline-flex items-center text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 font-medium rounded-lg px-5 py-2.5 text-center">
                        Get Started Now
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                    </Link>
                </div>
            </div>
            
            {/* call to action */}
            <div className="mt-20 text-center">
                <div className="inline-block p-1 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600">
                    <div className="bg-white dark:bg-gray-900 rounded-lg py-8 px-12">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                            Ready to start your travel journal?
                        </h3>
                        <Link href="/register" 
                            className="inline-block px-8 py-3 bg-yellow-400 hover:bg-yellow-300 text-indigo-900 font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                            Register for Free
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Introduction;