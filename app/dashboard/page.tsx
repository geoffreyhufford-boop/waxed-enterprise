'use client'

import { DashboardHeader, StatCard } from '@/components/dashboard'
import { quickStats } from '@/lib/dashboard-data'
import { usePinnedWidgets } from '@/lib/use-pinned-widgets'
import { widgetRegistry } from '@/lib/widget-registry'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { WidgetDef } from '@/lib/widget-registry'

function SortableWidget({ widget }: { widget: WidgetDef }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${widget.size === 'lg' ? 'lg:col-span-2' : ''} cursor-grab active:cursor-grabbing`}
      {...attributes}
      {...listeners}
    >
      {widget.render()}
    </div>
  )
}

export default function OverviewPage() {
  const { pinned, reorder } = usePinnedWidgets()

  const widgets = pinned
    .map((id) => widgetRegistry[id])
    .filter(Boolean)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = pinned.indexOf(active.id as string)
    const newIndex = pinned.indexOf(over.id as string)
    if (oldIndex === -1 || newIndex === -1) return

    const next = [...pinned]
    next.splice(oldIndex, 1)
    next.splice(newIndex, 0, active.id as string)
    reorder(next)
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <DashboardHeader
        title="Overview"
        subtitle="Wax & Groove Records — Enterprise Plan"
        actions={
          <button className="btn-primary text-sm px-4 py-2">+ Add Record</button>
        }
      />

      {/* Stats Row */}
      <div className="shrink-0 grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {quickStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Pinned Widgets Grid */}
      {widgets.length > 0 ? (
        <div className="flex-1 min-h-0 overflow-y-auto">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={pinned} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pb-4">
                {widgets.map((w) => (
                  <SortableWidget key={w.id} widget={w} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      ) : (
        <div className="flex-1 min-h-0 flex items-center justify-center">
          <div className="text-center space-y-3">
            <span className="text-4xl text-waxe-text-muted">&#9734;</span>
            <p className="text-sm text-waxe-text-secondary">No pinned widgets</p>
            <p className="text-xs text-waxe-text-muted max-w-xs">
              Click the star icon on any card throughout the dashboard to pin it here.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
