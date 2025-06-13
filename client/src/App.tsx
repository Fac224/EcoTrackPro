import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import ListDriveway from "@/pages/ListDriveway";
import Search from "@/pages/Search";
import DrivewayDetails from "@/pages/DrivewayDetails";
import BookingPage from "@/pages/BookingPage";

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/list-driveway" component={ListDriveway} />
        <Route path="/search" component={Search} />
        <Route path="/driveways/:id" component={DrivewayDetails} />
        <Route path="/book/:id" component={BookingPage} />
        <Route component={NotFound} />
      </Switch>
    </TooltipProvider>
  );
}

export default App;
