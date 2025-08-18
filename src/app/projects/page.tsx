"use client";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/stores/project-store";
import { useRouter } from "next/navigation";
import React from "react";

const ProjectPage = () => {
  const { createNewProject } = useProjectStore();
  const router = useRouter();

  const handleCreateProject = async () => {
    const projectId = await createNewProject("New Project");
    console.log("projectId", projectId);
    router.push(`/video-editor/${projectId}`);
  };

  return (
    <div>
      <Button onClick={handleCreateProject}>开始项目</Button>
    </div>
  );
};

export default ProjectPage;
