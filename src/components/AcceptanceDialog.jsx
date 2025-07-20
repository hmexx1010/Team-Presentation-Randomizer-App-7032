import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMic, FiX, FiCheck, FiStar } = FiIcons;

const AcceptanceDialog = ({ presenter, onAccept, onDecline, micDropReason }) => {
  const [showDeclineReason, setShowDeclineReason] = useState(false);
  const [declineReason, setDeclineReason] = useState('');

  const handleAccept = () => {
    onAccept('');
  };

  const handleDecline = () => {
    if (showDeclineReason) {
      onDecline(declineReason);
    } else {
      setShowDeclineReason(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
    >
      <motion.div
        initial={{ scale: 0.8, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.8, y: 50, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-lg w-full shadow-2xl border-4 border-gradient-to-r from-purple-500 to-blue-500"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <SafeIcon icon={FiMic} className="w-12 h-12 text-white" />
          </motion.div>

          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-gray-800 dark:text-white mb-4"
          >
            {showDeclineReason ? "Why can't you present?" : "Ready to Take the Stage?"}
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 dark:text-gray-300 text-lg"
          >
            {showDeclineReason ? "Let the team know why you need to skip:" : `${presenter}, the spotlight is yours! 🌟`}
          </motion.p>

          {/* Show the mic drop reason */}
          {!showDeclineReason && micDropReason && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-xl border-l-4 border-purple-500"
            >
              <div className="flex items-center mb-2">
                <SafeIcon icon={FiStar} className="w-5 h-5 text-purple-600 mr-2" />
                <span className="font-semibold text-purple-800 dark:text-purple-300">Mic Drop Reason:</span>
              </div>
              <p className="text-gray-700 dark:text-gray-200 italic">
                "{micDropReason}"
              </p>
            </motion.div>
          )}
        </div>

        {showDeclineReason ? (
          <div className="space-y-6">
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Enter your reason for skipping..."
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              rows="3"
            />
            <div className="flex justify-end space-x-4">
              <motion.button
                onClick={() => setShowDeclineReason(false)}
                className="px-6 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Back
              </motion.button>
              <motion.button
                onClick={() => onDecline(declineReason)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all shadow-lg"
                disabled={!declineReason.trim()}
                whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(239,68,68,0.3)" }}
                whileTap={{ scale: 0.98 }}
              >
                Submit
              </motion.button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            <motion.button
              onClick={handleAccept}
              className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg flex items-center justify-center space-x-3 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 transition-all shadow-lg"
              whileHover={{ scale: 1.02, boxShadow: "0 15px 30px rgba(34,197,94,0.4)" }}
              whileTap={{ scale: 0.98 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <SafeIcon icon={FiCheck} className="w-6 h-6" />
              <span>Let's Rock This! 🎸</span>
            </motion.button>

            <motion.button
              onClick={handleDecline}
              className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-lg flex items-center justify-center space-x-3 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800 transition-all shadow-lg"
              whileHover={{ scale: 1.02, boxShadow: "0 15px 30px rgba(239,68,68,0.4)" }}
              whileTap={{ scale: 0.98 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <SafeIcon icon={FiX} className="w-6 h-6" />
              <span>Need to Skip</span>
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AcceptanceDialog;