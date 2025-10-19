import { motion } from "framer-motion";

interface FormLandingPageProps {
  currentForm: number;
  handleSlidePlus: () => void;
}

export default function FormLandingPage({
  currentForm,
  handleSlidePlus,
}: FormLandingPageProps) {
  return (
    <div className="space-y-10 text-center">
      <div className="space-y-3">
        <div className="flex">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold">Hello there,</h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold ml-2">[name]!</h1>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.8, duration: 0.5 }}
        >
          <h2 className="text-xl font-bold">Let's get that event set up.</h2>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay: 2.5,
          duration: 1,
        }}
      >
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <button
            onClick={handleSlidePlus}
            className="px-5 py-3 bg-blue-400 hover:bg-blue-500 hover:cursor-pointer text-xl rounded-full text-white transition-all duration-200"
          >
            Get started
          </button>
        </motion.button>
      </motion.div>
    </div>
  );
}
