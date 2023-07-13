import React, { useState, useEffect } from 'react';
import { useInView, useAnimate, AnimatePresence, motion } from 'framer-motion';
import WelcomeWrapper from '../WelcomeWrapper';
import Header from '../Header';
import More from '../More';
import Hero from '../Hero';
import AuthModal from '../../auth/AuthModal';

export default function WelcomePage({ setToken, setName }) {
  const [authModal, setAuthModal] = useState(false);
  const [authForm, setAuthForm] = useState('');
  const [detailScope, _] = useAnimate();
  const [buttonScope, animateButton] = useAnimate();
  const [authButtonScope, animateAuthButton] = useAnimate();
  const [learnMoreScope, animateLearnMore] = useAnimate();
  const isInView = useInView(detailScope);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (isInView) {
      animateButton(buttonScope.current, { opacity: 1 }, { delay: 1.5 });
      animateAuthButton(
        authButtonScope.current,
        {
          display: 'grid',
        },
        {
          delay: 1.5,
        }
      );
      animateLearnMore(
        learnMoreScope.current,
        { display: 'block' },
        { delayChildren: 10, delay: 4 }
      );
    }
  }, [isInView]);
  return (
    <motion.div
      style={{ height: '100%' }}
      initial={{ overflowY: 'hidden' }}
      animate={{ overflowY: 'scroll' }}
      transition={{ duration: 4.0 }}
    >
      <WelcomeWrapper>
        <AnimatePresence mode='wait' initial={false}>
          {authModal ? (
            <AuthModal
              setAuthModal={setAuthModal}
              setAuthForm={setAuthForm}
              currentAuthForm={authForm}
              setToken={setToken}
              setName={setName}
            />
          ) : (
            ''
          )}
        </AnimatePresence>
        <Header
          authButtonScope={authButtonScope}
          setAuthModal={setAuthModal}
          setAuthForm={setAuthForm}
        />
        <Hero detailScope={detailScope} buttonScope={buttonScope} />
      </WelcomeWrapper>
      <More
        learnMoreScope={learnMoreScope}
        setAuthModal={setAuthModal}
        setAuthForm={setAuthForm}
      />
    </motion.div>
  );
}
