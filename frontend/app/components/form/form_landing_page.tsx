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
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold">Hello there!</h1>
          </motion.div>
          {/* <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold ml-2">[name]!</h1>
          </motion.div> */}
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold">
            Let's get that event set up.
          </h2>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay: 1.3,
          duration: 1,
        }}
      >
        <motion.button
          onClick={handleSlidePlus}
          className="text-lg font-semibold bg-gradient-to-r from-blue-300 via-blue-500 to-blue-300 py-3 px-6 rounded-full text-white"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get started
        </motion.button>
      </motion.div>
    </div>
  );
}
