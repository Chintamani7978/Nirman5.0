# Emergency Crisis Mode - Component Library

This directory contains all UI components for the Emergency Crisis Mode feature.

## Components

### IncidentPrioritizer.tsx
**Displays a prioritized list of emergency incidents with selection interface.**

```tsx
<IncidentPrioritizer
  incidents={incidents}
  selectedIncident={selectedIncident}
  onSelectIncident={setSelectedIncident}
  onAssignResources={handleAutoAssignResources}
/>
```

**Features:**
- Live incident list sorted by priority (0-100 score)
- Click-to-select with detail panel
- Shows: title, type, severity, location, population, confidence, time
- Life-threatening indicator
- "Assign Resources" button
- Responsive grid layout (lg:col-span-2)

**Props:**
- `incidents`: EmergencyIncident[] - Array of incidents
- `selectedIncident`: EmergencyIncident | null - Currently selected incident
- `onSelectIncident`: Function to handle incident selection
- `onAssignResources`: Function to trigger resource assignment

---

### ResourceDispatcher.tsx
**Displays deployed resources with real-time status tracking.**

```tsx
<ResourceDispatcher
  deployments={deployments}
  isLoading={isLoading}
/>
```

**Features:**
- Resource grid with status cards
- Status badges (Assigned, En Route, Arrived, Completed)
- Progress bar for deployment stage
- Distance, ETA, and priority metrics
- Summary stats footer
- Alert for long ETAs (>30 min)

**Props:**
- `deployments`: ResourceDeployment[] - Array of deployed resources
- `isLoading`: boolean - Loading state

**Status Colors:**
- Yellow: Assigned (pending)
- Blue: En Route
- Green: Arrived/Completed
- Gray: Completed

---

### CrisisMap.tsx
**Map visualization with incident markers and zone overlays.**

```tsx
<CrisisMap
  incidents={incidents}
  zones={zones}
  selectedIncident={selectedIncident}
/>
```

**Features:**
- OpenStreetMap integration placeholder
- Incident legend with markers
- Risk zone legend with radius info
- Severity distribution heatmap (4 colors)
- Open Full Map link
- Note about Mapbox/Leaflet integration

**Props:**
- `incidents`: EmergencyIncident[] - Array of incidents
- `zones`: CrisisZone[] - Array of predicted zones
- `selectedIncident`: EmergencyIncident | null - Highlighted incident

**Future Enhancements:**
- Mapbox GL or Leaflet integration
- Real-time marker updates
- Clustering for many incidents
- Heatmap overlay
- Route planning

---

### AlertBroadcaster.tsx
**Emergency alert sending interface with templates and history.**

```tsx
<AlertBroadcaster
  incidentId={selectedIncident?.id || null}
  onBroadcast={handleBroadcast}
  recentAlerts={alerts}
  isLoading={isLoading}
/>
```

**Features:**
- Alert type selector (evacuation, shelter, warning, medical)
- Customizable broadcast radius (1-50 km)
- Template-based messages
- Custom message override
- Recipient estimation (500-2000)
- Recent broadcasts history
- Status tracking (pending/sent)
- Disable without incident selection

**Props:**
- `incidentId`: string | null - Selected incident ID
- `onBroadcast`: Function(alertType, message, radiusKm) - Broadcast handler
- `recentAlerts`: Alert[] - Array of recent broadcasts
- `isLoading`: boolean - Loading state

**Alert Types:**
- **Evacuation**: "Please evacuate to higher ground immediately"
- **Shelter**: "Safe shelters are now open"
- **Warning**: "Heavy flooding expected - prepare supplies"
- **Medical**: "Medical assistance is available"

**Templates:**
Custom templates for each incident type (flood, cyclone, fire, earthquake, medical, accident)

---

### PredictedZonesViewer.tsx
**Displays predicted high-risk zones with risk levels and forecasts.**

```tsx
<PredictedZonesViewer
  zones={zones}
  isLoading={isLoading}
/>
```

**Features:**
- Zone list with risk level (1-10)
- Risk color coding (critical/high/medium/low)
- Risk gauge with progress bar
- Forecast confidence indicators
- Population estimates
- Statistics cards (critical zones, high zones, total at risk)
- Detailed zone information

**Props:**
- `zones`: PredictedZone[] - Array of predicted zones
- `isLoading`: boolean - Loading state

**Risk Levels:**
- 8-10: Critical (Red)
- 6-7: High (Orange)
- 4-5: Medium (Yellow)
- 1-3: Low (Blue)

**Forecast Confidence:**
- 🟢 Green: 80%+ High confidence
- 🟡 Yellow: 50-79% Moderate confidence
- 🔴 Red: <50% Low confidence

---

## Usage Example

```tsx
import IncidentPrioritizer from "@/components/emergency/IncidentPrioritizer";
import ResourceDispatcher from "@/components/emergency/ResourceDispatcher";
import CrisisMap from "@/components/emergency/CrisisMap";
import AlertBroadcaster from "@/components/emergency/AlertBroadcaster";
import PredictedZonesViewer from "@/components/emergency/PredictedZonesViewer";

export default function EmergencyDashboard() {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const { data: incidents } = useQuery({...});
  const { data: deployments } = useQuery({...});
  const { data: zones } = useQuery({...});

  return (
    <Tabs>
      <TabsContent value="incidents">
        <IncidentPrioritizer
          incidents={incidents}
          selectedIncident={selectedIncident}
          onSelectIncident={setSelectedIncident}
          onAssignResources={() => handleAssign()}
        />
      </TabsContent>

      <TabsContent value="resources">
        <ResourceDispatcher deployments={deployments} />
      </TabsContent>

      <TabsContent value="map">
        <CrisisMap
          incidents={incidents}
          zones={zones}
          selectedIncident={selectedIncident}
        />
      </TabsContent>

      <TabsContent value="zones">
        <PredictedZonesViewer zones={zones} />
      </TabsContent>

      <TabsContent value="alerts">
        <AlertBroadcaster
          incidentId={selectedIncident?.id}
          onBroadcast={handleBroadcast}
          recentAlerts={alerts}
        />
      </TabsContent>
    </Tabs>
  );
}
```

---

## Component Dependencies

All components depend on:
- `@/components/ui` - shadcn/ui components
- `lucide-react` - Icons
- `framer-motion` - Animations
- `react-query` - Data fetching

No internal dependencies between components.

---

## Styling

All components use:
- **Tailwind CSS** for styling
- **shadcn/ui** for UI primitives
- **Framer Motion** for animations
- **Lucide React** for icons

Colors follow the Tailwind palette:
- Primary: Blue (default)
- Destructive: Red (alerts)
- Success: Green (completed)
- Warning: Yellow/Orange (pending)

---

## Responsive Design

All components are responsive:
- **Mobile** (<640px): Stacked layout
- **Tablet** (640-1024px): 2-column grid
- **Desktop** (>1024px): Full layout

Use `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` pattern for responsive grids.

---

## Performance

- Components use `React.memo` where appropriate
- Framer Motion animations are GPU-accelerated
- Queries use React Query caching
- No unnecessary re-renders

---

## Accessibility

All components include:
- ARIA labels where needed
- Semantic HTML
- Keyboard navigation support
- Color-blind friendly indicators
- Font size scaling

---

## Future Enhancements

### CrisisMap
- Integrate Mapbox GL or Leaflet
- Real-time marker clustering
- Route planning
- Traffic layer integration

### AlertBroadcaster
- SMS delivery tracking
- Push notification delivery
- Email delivery tracking
- Delivery retry logic

### PredictedZonesViewer
- Weather API integration
- Real-time forecast updates
- Historical comparison
- Trend analysis

---

## Support

For issues or questions:
1. Check component documentation above
2. Review EmergencyCrisisMode.tsx for usage patterns
3. Check ARCHITECTURE_DIAGRAM.md for system overview
4. Review EMERGENCY_CRISIS_MODE_SETUP.md for deployment

---

**Version**: 1.0
**Status**: Production Ready ✅
**Last Updated**: 2024
