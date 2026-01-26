import Navbar from "@/components/navbar";
import ExploreView from "@/components/explore-view";

export default function ExplorePage() {
    return (
        <div className="flex flex-col min-h-screen bg-muted/50">
            <Navbar />
            <ExploreView />
        </div>
    );
}
