import { useContext, useEffect, useState } from "react";
import { contextApp } from "../shared/provider/store/ContextApp";
import type { IProject, ProjectCreateDTO } from "@/shared/interface/Projects";
import api from "@/service/api";

export default function useProject() {
  const { state, dispatch } = useContext(contextApp);
  const [projects, setProjects] = useState<IProject[]>(state.projects);
  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
  const [selectProject, setSelectProject] = useState<IProject | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [stats, setStats] = useState<{
    total: number;
    enRevision: number;
    devuelto: number;
    publicado: number;
  }>({
    total: 0,
    enRevision: 0,
    devuelto: 0,
    publicado: 0,
  });

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await api.get("/api/v1/projects/my-projects");
        const projectsData = await response.data;
        setProjects(projectsData);
        dispatch({ type: "SET_PROJECTS", payload: projectsData });
        setValueStats(projectsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (state.projects.length === 0) {
      fetchProjects();
    } else {
      setProjects(state.projects);
    }
  }, []);

  const onSubmitCreate = async (data: ProjectCreateDTO) => {
    setLoading(true);
    const dataCreate: ProjectCreateDTO = {
      name: data.name,
      objectives: data.objectives,
      beneficiaryPopulations: data.beneficiaryPopulations,
      budgets: data.budgets,
      startAt: convertToIsoDate(data.startAt),
      endAt: convertToIsoDate(data.endAt),
    };
    try {
      const response = await api.post("/api/v1/projects", dataCreate);
      const project = await response.data;
      dispatch({ type: "ADD_PROJECT", payload: project });
      setOpenModalCreate(false);
      setProjects((prevProjects) => [...prevProjects, project]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const convertToIsoDate = (date: string) => {
    const [year, month, day] = date.split("-");
    return `${year}-${month}-${day}T00:00:00.000Z`;
  };

  const setValueStats = (projects: IProject[]) => {
    setStats({
      total: projects.length,
      enRevision: projects.filter(
        (project: IProject) => project.status === "EN_REVISION"
      ).length,
      devuelto: projects.filter(
        (project: IProject) => project.status === "DEVUELTO"
      ).length,
      publicado: projects.filter(
        (project: IProject) => project.status === "PUBLICADO"
      ).length,
    });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(0);
  };

  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  return {
    projects,
    setProjects,
    dispatch,
    openModalCreate,
    setOpenModalCreate,
    openModalDelete,
    setOpenModalDelete,
    selectProject,
    setSelectProject,
    loading,
    setLoading,
    filter,
    setFilter,
    onSubmitCreate,
    stats,
    setStats,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
    currentPage,
    pageSize,
    sortBy,
    sortDirection,
  };
}
