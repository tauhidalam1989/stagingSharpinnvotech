'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="fixed inset-0 z-[1000000] flex items-center justify-center bg-transparent"
            >
                <div className="relative flex items-center justify-center">
                    {/* Loader Border (matching Angular's .loader-border) */}
                    <div className="absolute w-[100px] h-[100px] rounded-[10px] border-[3px] border-transparent"></div>

                    {/* Loader Image (matching Angular's .loader-image) */}
                    <div className="relative overflow-hidden rounded-[29px] w-[100px] h-[100px]">
                        <Image
                            src="/logo/Loader.gif"
                            alt="Loading..."
                            width={100}
                            height={100}
                            priority
                            className="object-cover"
                        />
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
