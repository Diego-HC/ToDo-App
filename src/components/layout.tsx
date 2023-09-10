import HeadComponent from "./HeadComponent";
import NavBar from "./NavBar";
import Sidebar from "./Sidebar";

type LayoutProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export default function Layout({ title, description, children }: LayoutProps) {
  return (
    <>
      <HeadComponent title={title} description={description} />
      <main>
        <div className="text-white h-screen flex flex-col overflow-hidden">
          <NavBar />
          <div className="flex w-screen h-full">
            <Sidebar />
            <div className="flex flex-1 flex-col h-full max-h-full max-w-full min-w-full items-center py-5 bg-slate-900 text-white">
              {children}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
