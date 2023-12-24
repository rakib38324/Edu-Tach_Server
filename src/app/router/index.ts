import { Router } from 'express';
import { Category_router } from '../modules/category/category.router';
import { Course_router } from '../modules/course/course.router';
import { Review_router } from '../modules/review/review.router';

const router = Router();

const modelRouters = [
  {
    path: '/',
    route: Category_router,
  },
  {
    path: '/',
    route: Course_router,
  },
  {
    path: '/',
    route: Review_router,
  },
];

modelRouters.forEach((route) => router.use(route.path, route.route));
export default router;
