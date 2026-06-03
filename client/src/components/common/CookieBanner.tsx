import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import useCookieConsent from '@/hooks/useCookieConsent';
import { Button } from "../ui/button";



const CookieBanner = () => {
    const {isVisible, acceptAll, declineAnalytics} = useCookieConsent();
  return (
    <AnimatePresence>
        {isVisible && (
          <motion.div
          initial={{y: 100, opacity: 0}}
          animate={{y:0, opacity: 1}}
          exit={{y: 100, opacity: 0}}
          transition={{ type: 'spring', stiffness: 300, damping: 30}}
          className='fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6'
          >
            <div className='max-w-4xl mx-auto bg-white border-t-2 border-primary rounded-t-2xl md:rounded-2xl shadow-[0_-4px_24px_rgba(0,0,0,0.08)] p-6 md:p-8'>
                <div className='flex items-center gap-3 mb-3'>
                    <ShieldCheck size={20} className='text-primary shrink-0'/>
                    <h3 className="font-display text-lg font-bold text-[#1A1A1A]">
                        We value your privacy
                    </h3>

                </div>

                <p className='text-gray-600 text-sm leading-relaxed mb-6'>
                    We use cookies to enhance your experience and analyse site traffic.
                    Essential cookies are always active.{' '}
                    <Link to='/privacy' className='text-primary underline underline-offset-2 hover:text-[#094a2e] transition-colors duration-200'>
                        Learn More
                    </Link>
                </p>
                <div className='flex flex-col sm:flex-row gap-3 items-center justify-center'>
                    <Button variant='default' onClick={acceptAll}>
                        Accept All
                    </Button>
                    
                    <Button variant='secondary' onClick={declineAnalytics}>
                        Decline
                    </Button>
                </div>
            </div>

          </motion.div>  

        )}
      
    </AnimatePresence>
  )
}

export default CookieBanner
