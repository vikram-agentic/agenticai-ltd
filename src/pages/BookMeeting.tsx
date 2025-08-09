import { MeetingScheduler } from "@/components/MeetingScheduler";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const BookMeetingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto py-12 px-4">
        <MeetingScheduler />
      </main>
      <Footer />
    </div>
  );
};

export default BookMeetingPage;
