import React from "react";
import { useState } from "react";
const Growth = () => {
  const giftsDescriptions = {
    admin: {
      name: "Gift of Administration is the Ministry's Leader",
      desc: "This gift gives you the ability to lead people to facilitate and carry out a project to completion in an organized manner.",
    },
    mercy: {
      name: "Gift of Mercy is the Ministry's Recruiter",
      desc: "This gift gives you the ability to attract and inspire people to join a cause or a group through your openness, authenticity, creativity and sensitivity.",
    },
    encouragement: {
      name: "Gift of Encouragement is the Ministry's Small Group Leader",
      desc: "This gift gives you the ability speak hope, wisdom and direction into people's life to spur them onto good works.",
    },
    treasurer: {
      name: "Gift of Giving is the Ministry's Treasurer",
      desc: "The gift gives you the ability to take large complicated information and put it in a simple memorable form for people to understand and apply.",
    },
    prophecy: {
      name: "Gift of Prophecy is the Ministry's Prayer Leader",
      desc: "This gift gives you the ability to seek the heart of God on a matter and intercede on behalf of people or the ministry for God's Will to be done.",
    },
    serving: {
      name: "Gift of Serving is the Ministry's Admin Assistant",
      desc: "This gift gives you the ability to be a support to whatever needs to be done to get the job done. You enjoy being the hands and feet.",
    },
  };

  const ministriesDesc = {
    outreach: {
      name: "Outreach Ministry",
      vision:
        "To reach Oshawa and its surrounding cities in Durham Region, meeting needs and creating networks and opportunities to introduce the gospel of Jesus Christ to people.",
      opportunities: [
        "Food Bank",
        "Outreach Events",
        "Marketing",
        "Website",
        "Missions",
        "Alpha Events",
        "Special Service",
      ],
    },
    impressions: {
      name: "First Impression Ministry",
      vision:
        "To make Church like Heaven on Earth by creating an accepting and friendly atmosphere where the love of God is demonstrated.",
      opportunities: [
        "Parking Attendants",
        "Greeters",
        "Runners/Shutters",
        "Visiting Table",
        "Ushers",
      ],
    },
    artsTech: {
      name: "Arts & Tech Ministry",
      vision:
        "Seeking out ways to produce the finest, high-tech, professional, exciting worship services, which makes the Word clearly seen and heard with cutting edge technology.",
      opportunities: [
        "Creative Team",
        "Audio Team",
        "Lighting & Stage Team",
        "Video Production & Camera Crew",
        "Social Media & Production Crew",
        "Setup Manager",
      ],
    },
    followUp: {
      name: "Follow-Up & Care Ministry",
      vision:
        "To provide the love, acceptance, friendliness, and compassion of Christ to the visitors first and to all those who come through the church doors with the purpose of assimilating them into the life and ministry of the church.",
      opportunities: [
        "Altar Call Team",
        "Visitation",
        "Telecare & Texting Team",
        "Support Team",
        "Letter/Email Writers",
      ],
    },
    worship: {
      name: "Worship Ministry",
      vision:
        "To create an atmosphere of worship in Spirit & Truth that will literally change lives. While we seek to provide music with excellence, the ultimate goal is help one to become drawn closer to Jesus Christ.",
      opportunities: ["Song Leaders", "Moderators", "Musicians", "Choir"],
    },
    smallGroups: {
      name: "Small Groups Ministry",
      vision:
        "To provide love, acceptance, friendliness, and compassion of Christ by connecting friends to the church through life groups.",
      opportunities: [
        "Life groups",
        "Small Groups",
        "Small Gorups Coach",
        "Alpha Groups",
        "Small Groups Leaders Trainer",
      ],
    },
    youthMinistry: {
      name: "Kids Ministry",
      vision:
        "to make kids of all ages feel special, providing a fun and safe environment to grow a relationship with Jesus Christ, teaching biblical truths through creative storytelling and purposeful activities",
      opportunities: [
        "4-8 year-old class",
        "9-12 year-old class",
        "Snacks Cordinators",
      ],
    },
  };

  // Vars for gifts
  const [gifts, setGifts] = useState({
    serving: { name: "Serving", value: null },
    encourage: { name: "Encouragement", value: null },
    giving: { name: "Giving", value: null },
    mercy: { name: "Mercy", value: null },
    teaching: { name: "Teaching", value: null },
    prophecy: { name: "Prophecy", value: null },
  });

  const [ministries, setMinistries] = useState({
    outreach: { name: "Outreach", value: null },
    techArts: { name: "Tech Arts", value: null },
    worship: { name: "Worship", value: null },
    smallGroups: { name: "Small Groups", value: null },
    youth: { name: "Children & Youth", value: null },
    followUp: { name: "Follow-Ups", value: null },
    impressions: { name: "First Impressions", value: null },
  });

  return (
    <>
      <div className="gifts-container w-full grid grid-cols-2 gap-20 mb-20">
        <form className="mx-5" action="">
          <h2 className="text-lg font-semibold pb-2">Gifts</h2>
          <div className="grid grid-cols-2 w-full gap-x-5">
            {Object.entries(gifts).map(([key, gift]) => (
              <input
                className="p-3 mb-6 bg-gray-100 rounded-lg"
                placeholder={gift.name}
                value={gift.value ?? ""}
                type="number"
                key={gift.name}
                onChange={(e) =>
                  setGifts((prev) => ({
                    ...prev,
                    [key]: {
                      ...prev[key],
                      value: parseInt(e.target.value) || "",
                    },
                  }))
                }
              />
            ))}
          </div>
          <button className="text-lg bg-accent text-white rounded-lg px-2 py-0.5 hover:cursor-pointer">
            Submit
          </button>
        </form>

        <div className="gifts-description mx-5">
          <ul className="bg-accent text-white rounded-lg py-8 px-10">
            {Object.entries(giftsDescriptions).map(([key, gift]) => (
              <li className="pb-5">
                <h4 className="text-center font-semibold">{gift.name}</h4>
                <span>{gift.desc}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="ministries-container w-full grid grid-cols-2 gap-20 mb-20">
        <form className="mx-5" action="">
          <h2 className="text-lg font-semibold pb-2">Ministry</h2>
          <div className="grid grid-cols-2 w-full gap-x-5">
            {Object.entries(ministries).map(([key, ministry]) => (
              <input
                className="p-3 mb-6 bg-gray-100 rounded-lg"
                placeholder={ministry.name}
                value={ministry.value ?? ""}
                type="number"
                key={key}
                onChange={(e) =>
                  setMinistries((prev) => ({
                    ...prev,
                    [key]: {
                      ...prev[key],
                      value: parseInt(e.target.value) || "",
                    },
                  }))
                }
              />
            ))}
          </div>
          <button className="text-lg bg-accent text-white rounded-lg px-2 py-0.5 hover:cursor-pointer">
            Submit
          </button>
        </form>
        <div className="ministries-description mx-5">
          <ul className="bg-accent text-white rounded-lg py-8 px-10">
            {Object.entries(ministriesDesc).map(([key, ministry]) => (
              <li className="pb-5">
                <h4 className="text-center font-semibold">{ministry.name}</h4>
                <span>
                  <span className="font-semibold">Vision: </span>
                  {ministry.vision}
                </span>
                <ul>
                  <span className="font-semibold">Opportunites: </span>
                  {ministry.opportunities.map((item, index) => (
                    <li className="inline">
                      {index < ministry.opportunities.length - 1
                        ? `${item}, `
                        : item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Growth;
