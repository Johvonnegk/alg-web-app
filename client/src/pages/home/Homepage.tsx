import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
const Homepage = () => {
  return (
    <>
      <div className="flex flex-col items-center mt-20 justify-center min-h-screen text-white page-sections bg-secondary">
        <div id="home" className="relative w-full bg-accent/40">
          <div className="w-full absolute inset-0 bg-[url('/alg_logo.png')] bg-center opacity-20"></div>
          <div className="w-full h-[200px] xl:h-[500px] flex items-center justify-center">
            <h1 className="text-3xl xl:text-5xl text-center text-white font-bold z-2">
              ABUNDANT LIFE GOSPEL CENTRE MULTIPLICATION
            </h1>
          </div>
        </div>

        <div className="relative flex home-section">
          <div className="bg-secondary">
            <h2>WELCOME</h2>
            <p>
              Welcome to the Multiplication Ministry’s Group Connection Page!
              We’re so glad you’re here. This is your one-stop space to get
              connected, stay involved, and find a group where you can grow in
              faith and community. Whether you’re a new visitor or a long-time
              member of Abundant Life Gospel Centre, this tool is designed to
              help you easily find and{" "}
              <a href="/signup" className="underline hover:text-accent">
                sign up
              </a>{" "}
              for an ACTIVATE Group or get involved as a group leader. Let’s
              grow together—welcome home!
            </p>
          </div>
          <div className="flex self-start items-center gap-x-2 font-bold">
            <Button className="btn-primary">
              <Link className="font-bold tracking-wide" to="/signup">
                SIGN-UP
              </Link>
            </Button>
            <span className="tracking-wide">- OR -</span>
            <Button className="btn-primary">
              <Link className="font-bold tracking-wide" to="/login">
                LOGIN
              </Link>
            </Button>
          </div>

          <span className="absolute top-[91%] left-0 w-full h-[20%] bg-secondary transform skew-y-1 origin-bottom z-2"></span>
        </div>
        <div id="about" className="relative about-section bg-accent">
          <div>
            <h2>ABOUT</h2>
            <p>
              This platform is part of the broader vision of ALG’s
              Multiplication Discipleship Ministry. Our goal is to make it easy
              for people to move from simply attending church to fully engaging
              in discipleship, fellowship, and service. ACTIVATE Groups are a
              key part of that process—small, vibrant groups where people can
              build relationships, deepen their walk with Christ, and become
              rooted in the life of the church. This page is a practical way to
              support that mission—helping people find their next step and
              empowering group leaders with the connections and info they need.
            </p>
          </div>
          <span className="absolute top-[90%] left-0 w-full h-[20%] bg-accent transform scale-x-[-1] skew-y-1 text-black origin-bottom z-2"></span>
        </div>
        <div id="contact" className="relative contact-section bg-secondary">
          <div>
            <h2>CONTACT</h2>
            <p>
              We’d love to hear from you! If you have questions about ACTIVATE
              Groups or need help getting connected, feel free to reach out:
              Abundant Life Gospel Centre 17 Erie Street Oshawa, ON, L1H 3R1
              Phone: (905) 433-1438 | Multiplication Director: Pastor Kevin
              Cole, Email: kevin@abundantlifegospelcentre.ca | Multiplication
              Director’s Assistant: Marsha Shepherd
              connect@abundatlifegospelcentre.ca | Church Secretary: Sharon
              Webb, Email: hello@abundantlifegospelcentre.ca | Church Website:{" "}
              <a
                href="abundantlifegospelcentre.ca"
                className="hover:underline hover:text-accent font-semibold"
              >
                abundantlifegospelcentre.ca
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Homepage;
