import BreadcrumbDemo from "@/components/BreadcrumbDemo";
import Comments from "@/components/Comments";
import CourseMaterials from "@/components/course-materials";
import CourseProgress from "@/components/CourseProgress";
import CustomVideoPlayer from "@/components/CustomVideoPlayer";
import Heading from "@/components/Heading";
import MyIcons from "@/components/MyIcons";

const HomePage = () => {
  return (
    <main className="container max-w-7xl mx-auto my-5">
      <BreadcrumbDemo />
      <Heading
        title="Starting SEO as your Home Based Business"
        className="text-xl sm:text-2xl mt-7 mb-5"
      />
      <div className="flex flex-col justify-between lg:flex-row gap-5 w-full">
        <div className="basis-2/3">
          <CustomVideoPlayer />
          <MyIcons />
          <CourseMaterials />
          <div className="hidden lg:block">
            <Comments />
          </div>
        </div>

        <div className="basis-1/3">
          <CourseProgress />
        </div>
      </div>
      <div className="lg:hidden">
        <Comments />
      </div>
    </main>
  );
};

export default HomePage;
