import { useContext, useEffect, useState } from "react";
import { contextApp } from "../shared/provider/store/ContextApp";
import type { IProject, ProjectCreateDTO } from "@/shared/interface/Projects";
import api from "@/service/api";

export default function useProject() {
  const { state, dispatch } = useContext(contextApp);
  const [projects, setProjects] = useState<IProject[]>(state.projects);
  const [projectsFilter, setProjectsFilter] = useState<IProject[] | null>(state.projects);
  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
  const [selectProject, setSelectProject] = useState<IProject | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [stats, setStats] = useState<{
    total: number;
    draft: number;
    inReview: number;
    returned: number;
    openForVoting: number;
    votingClosed: number;
  }>({
    total: 0,
    draft: 0,
    inReview: 0,
    returned: 0,
    openForVoting: 0,
    votingClosed: 0,
  });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/v1/leader/projects");
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

  useEffect(() => {
    if (state.projects.length === 0) {
      fetchProjects();
    } else {
      setProjects(state.projects);
      setValueStats(state.projects);
    }
  }, []);

  useEffect(() => {
    console.log(filter);
    switch (filter) {
      case "all":
        setProjectsFilter(null);
        break;
      case "DRAFT":
        setProjectsFilter(state.projects.filter((project) => project.status === "DRAFT"));
        break;
      case "IN_REVIEW":
        setProjectsFilter(state.projects.filter((project) => project.status === "IN_REVIEW"));
        break;
      case "RETURNED_WITH_OBSERVATIONS":
        setProjectsFilter(state.projects.filter((project) => project.status === "RETURNED_WITH_OBSERVATIONS"));
        break;
      case "OPEN_FOR_VOTING":
        setProjectsFilter(state.projects.filter((project) => project.status === "OPEN_FOR_VOTING"));
        break;
      case "VOTING_CLOSED":
        setProjectsFilter(state.projects.filter((project) => project.status === "VOTING_CLOSED"));
        break;
      default:
        break;
    }
  }, [filter, state.projects]);

  const onSubmitCreate = async (data: any) => {
    setLoading(true);
    if (/^[0-9]{10}$/.test(data.budgets)) {
      throw new Error("El presupuesto debe ser un número válido");
    }
    const dataCreate: ProjectCreateDTO = {
      name: data.name,
      description: data.description,
      objectives: data.objectives,
      beneficiaryPopulations: data.beneficiaryPopulations,
      budget: Number(data.budgets),
      startAt: convertToIsoDate(data.startAt),
      endAt: convertToIsoDate(data.endAt),
    };
    try {
      if (selectProject) {
        await api.put(`/api/v1/leader/project/${selectProject.id}`, dataCreate);
      } else {
        await api.post("/api/v1/leader/projects", dataCreate);
      }
      await fetchProjects();
      setOpenModalCreate(false);
      setSelectProject(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async () => {
    if (!selectProject) return;
    setLoading(true);
    try {
      await api.delete(`/api/v1/leader/project/${selectProject.id}`);
      dispatch({ type: "DELETE_PROJECT", payload: selectProject.id });
      setProjects((prev) => prev.filter(p => p.id !== selectProject.id));
      setOpenModalDelete(false);
      setSelectProject(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const submitProject = async (id: number) => {
    setLoading(true);
    try {
      const response = await api.put(`/api/v1/leader/project/${id}/submit`);
      const updatedProject = await response.data;
      dispatch({ type: "UPDATE_PROJECT", payload: updatedProject });
      setProjects((prev) => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const convertToIsoDate = (date: string) => {
    const [year, month, day] = date.split("-");
    return `${year}-${month}-${day}T00:00:00.000Z`;
  };

  const setValueStats = (projects: IProject[]) => {
    setStats({
      total: projects.length,
      draft: projects.filter(
        (project: IProject) => project.status === "DRAFT"
      ).length,
      inReview: projects.filter(
        (project: IProject) => project.status === "IN_REVIEW"
      ).length,
      returned: projects.filter(
        (project: IProject) => project.status === "RETURNED_WITH_OBSERVATIONS"
      ).length,
      openForVoting: projects.filter(
        (project: IProject) => project.status === "OPEN_FOR_VOTING"
      ).length,
      votingClosed: projects.filter(
        (project: IProject) => project.status === "VOTING_CLOSED"
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

  // Derived data: filter, sort and paginate locally
  const normalized = (s: string) => s?.toString().toLowerCase() ?? "";
  const sortedAndFiltered = (() => {
    const bySearch = projects.filter((p) => {
      const q = normalized(search);
      if (!q) return true;
      return (
        normalized(p.name).includes(q) ||
        normalized(String(p.id)).includes(q) ||
        normalized(p.objectives).includes(q)
      );
    });

    const byStatus = bySearch.filter((p) =>
      filter === "all" || !filter ? true : p.status === (filter as any)
    );

    const sorted = [...byStatus].sort((a: any, b: any) => {
      const dir = sortDirection === "asc" ? 1 : -1;
      const av = a[sortBy];
      const bv = b[sortBy];
      // Try numeric/date compare then fallback to string
      const aDate = Date.parse(av);
      const bDate = Date.parse(bv);
      if (!isNaN(aDate) && !isNaN(bDate)) return (aDate - bDate) * dir;
      const aNum = Number(av);
      const bNum = Number(bv);
      if (!isNaN(aNum) && !isNaN(bNum)) return (aNum - bNum) * dir;
      return normalized(String(av)).localeCompare(normalized(String(bv))) * dir;
    });

    return sorted;
  })();

  const totalFiltered = sortedAndFiltered.length;
  const start = currentPage * pageSize;
  const end = start + pageSize;
  const pagedProjects = sortedAndFiltered.slice(start, end);

  const [votingResults, setVotingResults] = useState<any[]>([]);

  const fetchVotingResults = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/v1/leader/projects/voting-results");
      setVotingResults(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    projects: pagedProjects,
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
    search,
    setSearch,
    onSubmitCreate,
    deleteProject,
    submitProject,
    stats,
    setStats,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
    currentPage,
    pageSize,
    sortBy,
    sortDirection,
    totalFiltered,
    projectsFilter,
    votingResults,
    fetchVotingResults,
  };
}
