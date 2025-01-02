'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface LoadingScreenProps {
    isLoading: boolean
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
    if (!isLoading) return null

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className="text-4xl font-bold text-white"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
            >
                SPCity
            </motion.div>
            <motion.div
                className="absolute bottom-10 left-0 right-0 flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <motion.div
                    className="w-16 h-1 bg-white rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '4rem' }}
                    transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
                />
            </motion.div>
        </motion.div>
    )
}

export default LoadingScreen

