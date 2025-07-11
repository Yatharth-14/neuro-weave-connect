
import React from "react";
import { motion } from "framer-motion";
import HeaderLogo from "./HeaderLogo";
import SearchBar from "./SearchBar";
import HeaderActions from "./HeaderActions";

const Header: React.FC = () => {
  return (
    <motion.header
      className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <HeaderLogo />
          <SearchBar />
          <HeaderActions />
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
