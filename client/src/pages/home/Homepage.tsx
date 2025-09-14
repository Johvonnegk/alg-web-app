import React from "react";
const Homepage = () => {
  return (
    <>
      <div className="flex flex-col items-center mt-20 justify-center min-h-screen text-white page-sections bg-secondary">
        <div id="home" className="relative w-full bg-accent/40">
          <div className="w-full absolute inset-0 bg-[url('/alg_logo.png')] bg-center opacity-20"></div>
          <div className="w-full h-[200px] xl:h-[500px] flex items-center justify-center">
            <h1 className="text-3xl xl:text-5xl text-center text-white font-bold z-2">
              ABUNDANT LIFE GOSPEL CENTRE ASSIMILATION
            </h1>
          </div>
        </div>

        <div className="relative home-section">
          <div className="bg-secondary">
            <h2>WELCOME</h2>
            <p>
              Welcome to the Assimilation Ministry’s Group Connection Page!
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
          <span className="absolute top-[91%] left-0 w-full h-[20%] bg-secondary transform skew-y-1 origin-bottom z-2"></span>
        </div>
        <div id="about" className="relative about-section bg-accent">
          <div>
            <h2>ABOUT</h2>
            <p>
              This platform is part of the broader vision of ALG’s Assimilation
              Discipleship Ministry. Our goal is to make it easy for people to
              move from simply attending church to fully engaging in
              discipleship, fellowship, and service. ACTIVATE Groups are a key
              part of that process—small, vibrant groups where people can build
              relationships, deepen their walk with Christ, and become rooted in
              the life of the church. This page is a practical way to support
              that mission—helping people find their next step and empowering
              group leaders with the connections and info they need.
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
              Abundant Life Gospel Centre 17 Erie Street Oshawa, ON, L1H 3R1 P:
              (905) 433-1438 Pastor Kevin Cole - Assimilation Director:
              kevin@abundantlifegospelcentre.ca Abigail Chambers – Assimilation
              Director’s Assistant: abigailchambers324@gmail.com Sharon Webb –
              Church Secretary: hello@abundantlifegospelcentre.ca Church
              Website: abundantlifegospelcentre.ca
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Homepage;
