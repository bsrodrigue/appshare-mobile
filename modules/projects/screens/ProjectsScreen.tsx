import { useListProjects, useCreateProject } from "@/modules/projects";
import { useEffect } from "react";
import { Button, Text, View } from "react-native";

export default function ProjectsScreen() {
  const { callListProjects, isLoading, projects } = useListProjects({
    onSuccess: (response) => console.log("Loaded projects:", response.data),
    onError: (error) => console.error("Failed to load:", error),
  });

  const { callCreateProject, isLoading: isCreating } = useCreateProject({
    onSuccess: (response) => {
      console.log("Created:", response.data);
      callListProjects();
    },
  });

  useEffect(() => {
    callListProjects();
  }, []);

  const handleCreate = () => {
    callCreateProject({
      title: "My New Project",
      description: "A description for my project",
    });
  };

  return (
    <View>
      {projects.map((project) => (
        <Text key={project.id}>{project.title}</Text>
      ))}
      <Button title="Create Project" onPress={handleCreate} />
    </View>
  );
}
