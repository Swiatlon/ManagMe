import { Container } from "@mui/material";
import { useState, useMemo } from "react";
import { IStory } from "../../../contract/stories.interfaces";
import { useGetAllProjectsQuery } from "../../../redux/apiSlices/projects.api.slice";
import { useDeleteStoryMutation, useGetAllStoriesQuery } from "../../../redux/apiSlices/stories.api.slices";
import StoryEmptyState from "./elements/StoryEmptyState";
import StoryFilters from "./elements/StoryFilters";
import StoryHeader from "./elements/StoryHeader";
import StoryTable from "./elements/StoryTable";
import StoryForm from "./StoryForm";
import { useSelector } from "react-redux";
import { selectUserId } from "../../../redux/statesSlices/auth.state.slice";

export default function StoryList() {
  const userId = useSelector(selectUserId)
  const [filters, setFilters] = useState({ project: '', status: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<IStory | null>(null);

  const { data: projects = [] } = useGetAllProjectsQuery();
  const { data: stories = [], refetch } = useGetAllStoriesQuery();
  const [deleteStory, {isLoading: isDeleting}] = useDeleteStoryMutation();

  const filteredStories = useMemo(() => {
    return stories.filter((story) => {
      const matchProject = story?.project?.id === filters?.project;

      return matchProject;
    });
  }, [stories, filters]);

  const handleDelete = async (id: string) => {
    deleteStory(id)
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingStory(null);
    refetch();
  };

  return (
    <Container maxWidth="xl">
      <StoryHeader
        selectedProjectName={projects.find((p) => p.id === filters.project)?.name || ""}
        onAdd={() => setModalOpen(true)}
      />

      <StoryEmptyState filters={filters} stories={filteredStories} />

      <StoryFilters
        filters={filters}
        setFilters={setFilters}
        projects={projects}
      />

      {filteredStories.length > 0 && (
        <StoryTable
          stories={filteredStories}
          projects={projects}
          onEdit={setEditingStory}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />
      )}

      {(modalOpen || !!editingStory) && (
        <StoryForm
        open={modalOpen || !!editingStory}
        story={editingStory}
        onClose={handleCloseModal}
        onSave={refetch}
        selectedProjectId={filters.project}
        currentUserId={userId!}
      />
      )}
    </Container>
  );
}
