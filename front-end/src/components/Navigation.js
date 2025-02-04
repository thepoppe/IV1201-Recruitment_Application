import Button from "@/components/ui/Button";

export default function Navigation() {
  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <span className="text-xl font-bold">Amusement Park</span>
          </div>
          <div className="flex gap-4">
            {/* Login button */}
            <Button>Login</Button>
            {/* Register button */}
            <Button>Register</Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
