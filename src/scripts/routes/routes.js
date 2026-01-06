import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import AddStoryPage from '../pages/add story/add-story-page';
import AuthPage from '../pages/auth/auth-page';

const routes = {
  '/': new HomePage(),
  '/about': new AboutPage(),
  '/add-story': new AddStoryPage(),
  '/login': new AuthPage(),
  '/register': new AuthPage(),
};

export default routes;
