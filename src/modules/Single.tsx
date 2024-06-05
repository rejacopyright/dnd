import {
  DndContext,
  DragOverlay,
  MouseSensor,
  rectIntersection,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove, rectSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { orderBy } from 'lodash'
import sortBy from 'lodash/sortBy'
import { FC, useEffect, useState } from 'react'

import { dataFruits } from '../__mock'

const uniqKey = 'uuid'
const orderKey = 'order'

const Item: FC<any> = ({ id, component, itemClass = '' }) => {
  const {
    active,
    over,
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging: isPlaceholder,
    overIndex,
  } = useSortable({ id })

  const style: any = {
    transform: CSS?.Translate?.toString(transform),
    opacity: isPlaceholder ? 0.5 : 1,
    height: active && isPlaceholder && overIndex >= 0 ? over?.rect?.height : 'auto',
    transition: active && !isPlaceholder ? 'transform 200ms ease 0s' : 'unset',
  }

  return (
    <div className='w-100 h-100' ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div
        className={`h-100 card border-0 card-body user-select-none ${isPlaceholder ? '' : ''} ${itemClass}`}>
        {component}
      </div>
    </div>
  )
}

const Index: FC<any> = () => {
  const sensors: any = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))
  const [itemsData, setItemsData] = useState<any>([])
  const [activeIdx, setActiveIdx] = useState<any>(undefined)

  useEffect(() => {
    setItemsData(orderBy(dataFruits, orderKey))
  }, [])

  const handleDragStart: any = (e: any) => {
    const { active } = e || {}
    const { id } = active
    const detail: any = itemsData?.find((f: any) => f?.[uniqKey] === id)
    setActiveIdx(detail)
  }

  const handleDragEnd: any = (e: any) => {
    const { active, over } = e || {}
    const { id } = active || {}
    const { id: overId } = over || {}

    const activeItem: any = itemsData?.find((f: any) => f?.[uniqKey] === id)
    const overItem: any = itemsData?.find((f: any) => f?.[uniqKey] === overId)

    const activeIndex: any = itemsData?.findIndex(
      (f: any) => activeItem?.[uniqKey] === f?.[uniqKey]
    )
    const overIndex: any = itemsData?.findIndex((f: any) => overItem?.[uniqKey] === f?.[uniqKey])

    if (activeIndex !== overIndex) {
      const res: any = arrayMove(itemsData, activeIndex, overIndex)?.map(
        (m: any, index: number) => {
          m[orderKey] = index + 1
          return m
        }
      )
      setItemsData(res)
    }

    setActiveIdx(undefined)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}>
      <div className='row mt-5'>
        <div className='col-lg-8 offset-lg-2'>
          <div className='border border-light rounded pt-3 px-3'>
            <div className='row'>
              <SortableContext
                items={sortBy(itemsData || [], orderKey)?.map((ctx: any) => ctx?.[uniqKey])}
                strategy={rectSortingStrategy}>
                {itemsData?.length ? (
                  sortBy(itemsData || [], orderKey)?.map((ctx: any) => (
                    <div className='col-md-4 mb-3' key={ctx?.[uniqKey]}>
                      <Item
                        id={ctx?.[uniqKey]}
                        itemClass='bg-light'
                        component={<p className='m-0'>{ctx?.name}</p>}
                      />
                    </div>
                  ))
                ) : (
                  <div className='col-12'>
                    <div
                      className='mb-3 d-flex align-items-center justify-content-center'
                      style={{ height: '100px', opacity: '0.25' }}>
                      Drag over here to fill the card...
                    </div>
                  </div>
                )}
              </SortableContext>
              <DragOverlay
                className='p-0'
                adjustScale={false}
                dropAnimation={null}
                transition={'transform 0ms ease'}
                wrapperElement={undefined}>
                {activeIdx?.[uniqKey] && (
                  <Item
                    id={activeIdx?.[uniqKey]}
                    itemClass='bg-dark text-white'
                    component={<p className='m-0'>{activeIdx?.name}</p>}
                  />
                )}
              </DragOverlay>
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  )
}

export default Index
