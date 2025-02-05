import Button from "@/components/ui/Button";

export default function Home() {
  const handleClick = () => {
    alert("Application form is not available yet");
  };

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-6">
        Welcome to Amusement Park Recruitment!
      </h1>
      <p className="max-w-lg text-lg mb-6">
        Join our team and be part of the excitement! We’re looking for
        passionate individuals to help create unforgettable experiences for our
        visitors. Apply today and start your journey with us! 🚀🎢
      </p>
      <Button>Apply now</Button>
    </div>
  );
}
