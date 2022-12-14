import {
  FC,
  ReactElement,
  useCallback,
  cloneElement,
  useRef,
  useMemo,
} from 'react';
import {
  Routes,
  Route,
  useLocation,
  useNavigationType,
} from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { ToastContainer } from 'react-toastify';
import { routes } from './routes';

import 'react-toastify/dist/ReactToastify.css';
import './style.scss';

const fadingLocations = ['/'];

const App: FC = () => {
  const location = useLocation();
  const navigationType = useNavigationType();

  const prevLocationRef = useRef(location.pathname);

  const cssTransitionClasses = useMemo(() => {
    const prevLocationPathname = prevLocationRef.current;
    prevLocationRef.current = location.pathname;

    switch (navigationType) {
      case 'POP':
        if (fadingLocations.includes(location.pathname)) {
          return {
            exit: 'transform-vertical-exit',
            exitActive: 'transform-vertical-exit-active',
            enter: 'fade-enter',
            enterActive: 'fade-enter-active',
          };
        }
        if (fadingLocations.includes(prevLocationPathname)) {
          return {
            exit: 'fade-exit',
            exitActive: 'fade-exit-active',
            enter: 'transform-vertical-enter',
            enterActive: 'transform-vertical-enter-active',
          };
        }
        return {
          exit: 'transform-right-exit',
          exitActive: 'transform-right-exit-active',
          enter: 'transform-left-enter',
          enterActive: 'transform-left-enter-active',
        };
      case 'PUSH':
      case 'REPLACE':
        if (fadingLocations.includes(location.pathname)) {
          return {
            exit: 'transform-vertical-exit',
            exitActive: 'transform-vertical-exit-active',
            enter: 'fade-enter',
            enterActive: 'fade-enter-active',
          };
        }
        if (fadingLocations.includes(prevLocationPathname)) {
          return {
            exit: 'fade-exit',
            exitActive: 'fade-exit-active',
            enter: 'transform-vertical-enter',
            enterActive: 'transform-vertical-enter-active',
          };
        }
        return {
          exit: 'transform-left-exit',
          exitActive: 'transform-left-exit-active',
          enter: 'transform-right-enter',
          enterActive: 'transform-right-enter-active',
        };
    }
  }, [location.pathname, navigationType]);

  const childFactory = useCallback(
    (child: ReactElement) =>
      cloneElement(child, {
        classNames: cssTransitionClasses,
        timeout: 300,
      }),
    [cssTransitionClasses],
  );

  return (
    <>
      <TransitionGroup className="app-wrapper" childFactory={childFactory}>
        <CSSTransition
          key={location.pathname}
          classNames={cssTransitionClasses}
          timeout={300}
        >
          <Routes location={location}>
            {routes.map((route) => (
              <Route
                path={route.path}
                element={route.element}
                key={route.path}
              />
            ))}
          </Routes>
        </CSSTransition>
      </TransitionGroup>
      <ToastContainer />
    </>
  );
};

export default App;
