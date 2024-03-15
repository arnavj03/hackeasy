import { getServerSession } from "next-auth";
import React, { useState } from "react";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { toast } from "react-toastify";
import constants from "@/lib/constants";
import HackPage from "@/components/Hack/HackPage";

const Event = (props) => {
  console.log(props)
  return (
    <div>
      <h1>{props?.event?.name}</h1>
      <p>{props?.event?.description}</p>
      <h2>Projects</h2>
      <ul>
        {props?.projects?.map((project) => (
          <li key={project?._id}>
            <Link href={`/project/${project._id}`}>
              <p>{project?.title}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Event;

export async function getServerSideProps(context) {
  let session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: true,
      },
    };
  }

  session = JSON.parse(JSON.stringify(session));

  // if (session?.user?.role !== constants.roles.USER) {
  //   return {
  //     redirect: {
  //       destination: "/",
  //       permanent: true,
  //     },
  //   };
  // }
  // get the event id from the context
  const eventId = context.params.id;

  const projects = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/events/admin/getProjects`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ eventId: eventId, userId: session.user.id }),
    }
  );
  const projectsData = await projects.json();

  console.log(projectsData)

  if(!projectsData.success) {
    return {
      redirect: {
        destination: `/event/${eventId}`,
        permanent: true,
      },
    };
  }

  const event = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/events/getEvent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ eventId: eventId, userId: session.user.id }),
    }
  );
  const eventData = await event.json();

  console.log(eventData)

  return {
    props: {
      session,
      email: session.user.email,
      projects: projectsData.data || null,
      event: eventData.event || null,
      id: session.user.id,
    },
  };
}