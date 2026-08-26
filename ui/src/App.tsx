import "./App.css";
import CanvasLayout from "./components/layouts/CanvasLayout";
import AppRoutes from "./routes/AppRoutes";

function App() {
    return (
        <CanvasLayout>
            <AppRoutes />
        </CanvasLayout>
    );
}

export default App;
