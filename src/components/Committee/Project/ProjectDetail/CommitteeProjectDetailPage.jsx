import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import TopNavBar from "../../../../layout/TopNavBar";
import SideNavBarInvestigator from "../../SideNavBar/SideNavBar";

import ProjectHeader from "../../../PM/Project/ProjectDetail/ProjectHeader";
import CommitteeTabs from "./CommitteeTabs";
import ProjectOverviewCard from "../../../PM/Project/ProjectDetail/ProjectOverviewCard";
import CommitteeBudgetTab from "../Main/CommitteeBudgetTab";
import ReleasePlanTab from "../../../PM/Project/ProjectBudget/ReleasePlanTab";

export default function CommitteeProjectDetailPage() {

    const { id } = useParams();

    const [project, setProject] = useState(null);
    const [budget, setBudget] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => { fetchProject(); fetchBudget(); }, [id]);

    const fetchProject = async () => {
        const res = await fetch(`http://127.0.0.1:8000/projects/${id}`);
        setProject(await res.json());
    };

    const fetchBudget = async () => {
        const res = await fetch(`http://127.0.0.1:8000/budget/project/${id}`);
        if (res.ok) setBudget(await res.json());
    };

    if (!project) return (
        <div className="flex items-center justify-center h-screen text-gray-400">
            Loading...
        </div>
    );

    return (
        <div>
            <TopNavBar />

            <div className="min-h-screen flex bg-gray-100 pt-20">

                <SideNavBarInvestigator
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />

                <div className={`flex-grow transition-all duration-300 ${isSidebarOpen ? "ml-80" : "ml-16"
                    }`}>
                    <div className="p-6">

                        <ProjectHeader project={project} backPath="/committee/projects" />

                        <CommitteeTabs
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            budgetStatus={budget?.status}
                        />

                        {activeTab === "overview" && (
                            <ProjectOverviewCard project={project} />
                        )}

                        {activeTab === "budget" && (
                            <CommitteeBudgetTab
                                project={project}
                                onBudgetChange={fetchBudget}
                            />
                        )}

                        {/* ✅ Committee has full control of release plan */}
                        {activeTab === "release_plan" && (
                            <ReleasePlanTab
                                project={project}
                                userRole="committee"
                            />
                        )}

                    </div>
                </div>

            </div>
        </div>
    );
}