import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/hooks/use-theme'
import { AppShell } from '@/app/layout/AppShell'
import { Dashboard } from '@/app/routes/Dashboard'
import { WorkflowEditor } from '@/app/routes/WorkflowEditor'
import { ComponentLibrary } from '@/app/routes/ComponentLibrary'
import { WorkflowSettings } from '@/app/routes/WorkflowSettings'
import { DeployMonitor } from '@/app/routes/DeployMonitor'
import { LayoutPicker } from '@/app/layouts/LayoutPicker'
import { LinearLayout } from '@/app/layouts/LinearLayout'
import { NotionLayout } from '@/app/layouts/NotionLayout'
import { FigmaLayout } from '@/app/layouts/FigmaLayout'
import { VSCodeLayout } from '@/app/layouts/VSCodeLayout'
import { RetoolLayout } from '@/app/layouts/RetoolLayout'
// Figma layout variations
import { FigmaPicker } from '@/app/layouts/figma/FigmaPicker'
import { FigmaClassic } from '@/app/layouts/figma/FigmaClassic'
import { FigmaCanvasFocus } from '@/app/layouts/figma/FigmaCanvasFocus'
import { FigmaSplitView } from '@/app/layouts/figma/FigmaSplitView'
import { FigmaFloatingPanels } from '@/app/layouts/figma/FigmaFloatingPanels'
import { FigmaWideProperties } from '@/app/layouts/figma/FigmaWideProperties'
// Floating panels layout variations
import { FloatingPicker } from '@/app/layouts/floating/FloatingPicker'
import { FloatingDockedIslands } from '@/app/layouts/floating/FloatingDockedIslands'
import { FloatingStackedCards } from '@/app/layouts/floating/FloatingStackedCards'
import { FloatingCommandPalette } from '@/app/layouts/floating/FloatingCommandPalette'
import { FloatingGlassmorphism } from '@/app/layouts/floating/FloatingGlassmorphism'
import { FloatingTabbedDrawer } from '@/app/layouts/floating/FloatingTabbedDrawer'
// Hybrid layout variations (docked islands + glassmorphism blend)
import { HybridPicker } from '@/app/layouts/hybrid/HybridPicker'
import { HybridFrostedDocks } from '@/app/layouts/hybrid/HybridFrostedDocks'
import { HybridCleanGlass } from '@/app/layouts/hybrid/HybridCleanGlass'
import { HybridMatteIslands } from '@/app/layouts/hybrid/HybridMatteIslands'
import { HybridBorderedGlass } from '@/app/layouts/hybrid/HybridBorderedGlass'
import { HybridSubtleBlur } from '@/app/layouts/hybrid/HybridSubtleBlur'
// Bordered glass variations (with grid toggle + connection arrows)
import { BorderedPicker } from '@/app/layouts/bordered/BorderedPicker'
import { BorderedClassic } from '@/app/layouts/bordered/BorderedClassic'
import { BorderedAnimated } from '@/app/layouts/bordered/BorderedAnimated'
import { BorderedNeon } from '@/app/layouts/bordered/BorderedNeon'
import { BorderedMinimal } from '@/app/layouts/bordered/BorderedMinimal'
import { BorderedGradientPaths } from '@/app/layouts/bordered/BorderedGradientPaths'
// Studio - Main workflow editor (Neon Border style)
import { Studio } from '@/app/routes/Studio'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Layout exploration routes - standalone pages */}
          <Route path="/layouts" element={<LayoutPicker />} />
          <Route path="/layouts/linear" element={<LinearLayout />} />
          <Route path="/layouts/notion" element={<NotionLayout />} />
          <Route path="/layouts/figma" element={<FigmaPicker />} />
          <Route path="/layouts/figma/classic" element={<FigmaClassic />} />
          <Route path="/layouts/figma/canvas-focus" element={<FigmaCanvasFocus />} />
          <Route path="/layouts/figma/split-view" element={<FigmaSplitView />} />
          <Route path="/layouts/figma/floating-panels" element={<FigmaFloatingPanels />} />
          <Route path="/layouts/figma/wide-properties" element={<FigmaWideProperties />} />
          <Route path="/layouts/figma-old" element={<FigmaLayout />} />
          {/* Floating panels variations */}
          <Route path="/layouts/floating" element={<FloatingPicker />} />
          <Route path="/layouts/floating/docked-islands" element={<FloatingDockedIslands />} />
          <Route path="/layouts/floating/stacked-cards" element={<FloatingStackedCards />} />
          <Route path="/layouts/floating/command-palette" element={<FloatingCommandPalette />} />
          <Route path="/layouts/floating/glassmorphism" element={<FloatingGlassmorphism />} />
          <Route path="/layouts/floating/tabbed-drawer" element={<FloatingTabbedDrawer />} />
          {/* Hybrid variations (docked islands + glassmorphism) */}
          <Route path="/layouts/hybrid" element={<HybridPicker />} />
          <Route path="/layouts/hybrid/frosted-docks" element={<HybridFrostedDocks />} />
          <Route path="/layouts/hybrid/clean-glass" element={<HybridCleanGlass />} />
          <Route path="/layouts/hybrid/matte-islands" element={<HybridMatteIslands />} />
          <Route path="/layouts/hybrid/bordered-glass" element={<HybridBorderedGlass />} />
          <Route path="/layouts/hybrid/subtle-blur" element={<HybridSubtleBlur />} />
          {/* Bordered glass variations */}
          <Route path="/layouts/bordered" element={<BorderedPicker />} />
          <Route path="/layouts/bordered/classic" element={<BorderedClassic />} />
          <Route path="/layouts/bordered/animated" element={<BorderedAnimated />} />
          <Route path="/layouts/bordered/neon" element={<BorderedNeon />} />
          <Route path="/layouts/bordered/minimal" element={<BorderedMinimal />} />
          <Route path="/layouts/bordered/gradient-paths" element={<BorderedGradientPaths />} />
          <Route path="/layouts/vscode" element={<VSCodeLayout />} />
          <Route path="/layouts/retool" element={<RetoolLayout />} />

          {/* Studio - Main workflow editor */}
          <Route path="/studio" element={<Studio />} />
          <Route path="/studio/:id" element={<Studio />} />

          {/* Main app routes */}
          <Route element={<AppShell />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/workflows" element={<Dashboard />} />
            <Route path="/workflows/new" element={<WorkflowEditor />} />
            <Route path="/workflows/:id" element={<WorkflowEditor />} />
            <Route path="/components" element={<ComponentLibrary />} />
            <Route path="/settings" element={<WorkflowSettings />} />
            <Route path="/deploy" element={<DeployMonitor />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
