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
    pendiente: number;
    enRevision: number;
    devuelto: number;
    publicado: number;
    listoParaPublicar: number;
  }>({
    total: 0,
    pendiente: 0,
    enRevision: 0,
    devuelto: 0,
    publicado: 0,
    listoParaPublicar: 0,
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
      setValueStats(state.projects);
    }
  }, []);

  useEffect(() => {
    console.log(filter);
    switch (filter) {
      case "all":
        setProjectsFilter(null);
        break;
      case "pendiente":
        setProjectsFilter(state.projects.filter((project) => project.status === "PENDIENTE"));
        break;
      case "enRevision":
        setProjectsFilter(state.projects.filter((project) => project.status === "EN_REVISION"));
        break;
      case "devuelto":
        setProjectsFilter(state.projects.filter((project) => project.status === "DEVUELTO"));
        break;
      case "publicado":
        setProjectsFilter(state.projects.filter((project) => project.status === "PUBLICADO"));
        break;
      default:
        break;
    }
  }, [filter]);

  const onSubmitCreate = async (data: ProjectCreateDTO) => {
    setLoading(true);
    if (/^[0-9]{10}$/.test(data.budgets)) {
      throw new Error("El presupuesto debe ser un número válido");
    }
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
      pendiente: projects.filter(
        (project: IProject) => project.status === "PENDIENTE"
      ).length,
      enRevision: projects.filter(
        (project: IProject) => project.status === "EN_REVISION"
      ).length,
      devuelto: projects.filter(
        (project: IProject) => project.status === "DEVUELTO"
      ).length,
      publicado: projects.filter(
        (project: IProject) => project.status === "PUBLICADO"
      ).length,
      listoParaPublicar: projects.filter(
        (project: IProject) => project.status === "LISTO_PARA_PUBLICAR"
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
  };
}
