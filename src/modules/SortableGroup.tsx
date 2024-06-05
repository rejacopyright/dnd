import {
  DndContext,
  DragOverlay,
  MouseSensor,
  rectIntersection,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove, rectSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import flatMap from 'lodash/flatMap'
import orderBy from 'lodash/orderBy'
import { FC, useEffect, useState } from 'react'

import { dataAnimals, dataCars, dataCountry, dataFruits } from '../__mock'
import { snapTopToCursor } from './__util'

const dummyGroup = [
  { uuid: 'group-1', order: 1, title: 'Fruits', children: dataFruits?.slice(0, 4) },
  { uuid: 'group-2', order: 2, title: 'Animals', children: dataAnimals?.slice(0, 2) },
  { uuid: 'group-3', order: 3, title: 'Cars', children: dataCars?.slice(0, 0) },
  { uuid: 'group-4', order: 4, title: 'Country', children: dataCountry?.slice(0, 3) },
]
const uniqKey = 'uuid'
const orderKey = 'order'
const childKey = 'children'

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
        className={`h-100 card border-0 card-body user-select-none justify-content-center ${isPlaceholder ? '' : ''} ${itemClass}`}>
        {component}
      </div>
    </div>
  )
}

const DroppableGroup: FC<any> = ({ data }) => {
  const { setNodeRef } = useDroppable({ id: data?.[uniqKey] })

  const {
    active,
    over,
    attributes,
    listeners,
    setNodeRef: sortableGroup,
    transform,
    isDragging,
    overIndex,
  } = useSortable({ id: data?.[uniqKey] })

  const scale: any = transform ? { ...transform, scaleX: 1, scaleY: 1 } : transform
  const style: any = {
    transform: CSS?.Transform?.toString(scale),
    opacity: isDragging ? 0.35 : 1,
    height: active && isDragging && overIndex >= 0 ? over?.rect?.height : '100%',
    transition: active && !isDragging ? 'transform 200ms ease 0s' : 'unset',
  }
  return (
    <SortableContext
      id={data?.[uniqKey]}
      items={orderBy(data?.[childKey] || [], orderKey)?.map((ctx: any) => ctx?.[uniqKey])}
      strategy={rectSortingStrategy}>
      <div
        className='border border-light rounded overflow-hidden position-relative bg-white'
        ref={sortableGroup}
        style={style}>
        <div
          className='bg-light p-3 fw-bold text-center border-bottom position-relative user-select-none'
          {...attributes}
          {...listeners}>
          <img
            className='position-absolute start-0 px-3 pe-none'
            src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAqxJREFUSEuV1VuIllUUBuBnNE3KA3YhpDGpF5lhkpJ5KkgoDSSk0yRYiRgoSAdvQrzoKhQvAkvBsi4US02QoTQJIoUixTAkIam0A5lkHoo8lgzqXrKUr7/5Z77ZsPn+fx/Wu9e73rVWi/+O+ViO1ViGjob9e/E7jjasN/3bUtmZhjdxK37CWrxb2X+5rD9XztyCADpZB+QawCj0wxHsx3j0waMJchn78CJm4jRW1AW4B58U1xfgHDZiSdLzBnbiCfyGBzEOT6GtLsCnmFouHMwLd+EbnMXofG2s/V3A78BwBPCkugBjsB5T8G+h5Wu8gN04hJewI/cGF+Mxv8KwugDXzgVQvDIoivkLDlQUcwEDi8puzHPxbVTZ/zCrKgqaNhR59k0lLcJblRtnMKTE5x9cLCobihPdeVEFiLOhplWF53XpRfX+n4XKEfn6U2jHnXitAvhxofSv6qVGgK4e9AfuxvGkLzx5PGMVCttaYjanqO35VFpQ3N4M4AZMxs2p/0iqMBLKie8urCyGPiyS/bZ4sDR/B8XPFCY2pTJf7Qwg1r5IKoKWB7AtX3s/fm5wcy62IETwSlHcfXgyvWnrDGBAGn+4GP8MNxWuN2dWB+ffd8Fjb0TWX0IrvmxG0QeYUfidnpq/HT9iJH7tTjm5f1uxsacZQGh8exa1ifghMzgCV3dMwHtdqWhQKiRKc3jS0zGrUNVpkKuGQpZRXZ9OGfYEZGEoqU4evJOSHZvBqwuyBt/VAYiidhjzUk11AHploXy2DkAYjPY5G1EQz9dAiEYVday1LkD/1H8k1OJuAKKl7k2A1+sChM1HSiv9KLM6MjbyonFEeYmYHcvzHT0BCGMPZY++mkQ5o7JG1obxaL9vp5dRDPUUIO5EvwjZPpYtNUpLFMDP8X622+ueXQGiaI3k1Nh3FwAAAABJRU5ErkJggg=='
            alt='move'
          />
          <div className=''>{data?.title}</div>
        </div>
        <div className='pt-3 px-3' ref={setNodeRef}>
          {data?.[childKey]?.length ? (
            <div className='row'>
              {orderBy(data?.[childKey] || [], orderKey)?.map((ctx: any) => (
                <div className='col-md-4 mb-3' key={ctx?.[uniqKey]}>
                  <Item
                    id={ctx?.[uniqKey]}
                    itemClass='bg-light'
                    component={<p className='m-0'>{ctx?.name}</p>}
                  />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div style={{ height: '75px' }} />
              <div
                style={{
                  opacity: '0.25',
                  paddingTop: '50px',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}>
                Drag over here to fill the card...
              </div>
            </>
          )}
        </div>
      </div>
    </SortableContext>
  )
}

const Index: FC<any> = () => {
  const sensors: any = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))
  const [itemsData, setItemsData] = useState<any>([])
  const [activeIdx, setActiveIdx] = useState<any>(undefined)
  const [isGroup, setIsgroup] = useState<boolean>(false)

  useEffect(() => {
    setItemsData(
      dummyGroup?.map((m: any) => {
        m[childKey] = orderBy(m?.[childKey], orderKey)
        return m
      })
    )
  }, [])

  const findContainer: any = (idx: any) => {
    if (itemsData?.find((f: any) => f?.[uniqKey] === idx)) {
      return itemsData?.find((f: any) => f?.[uniqKey] === idx)
    }
    return itemsData?.find((f: any) => f?.[childKey]?.find((f: any) => f?.[uniqKey] === idx))
  }

  const handleDragStart: any = (e: any) => {
    const { active } = e || {}
    const { id } = active
    let detail: any
    if (active?.data?.current?.sortable?.containerId === 'group') {
      setIsgroup(true)
      detail = itemsData?.find((f: any) => f?.[uniqKey] === id)
    } else {
      setIsgroup(false)
      detail = flatMap(itemsData, childKey)?.find((f: any) => f?.[uniqKey] === id)
    }
    setActiveIdx(detail)
  }

  const handleDragOver: any = (e: any) => {
    const { active, over } = e || {}
    const { id: idx } = active || {}
    const { id: overId } = over || {}

    const activeGroup: any = findContainer(idx)
    const overGroup: any = findContainer(overId)

    if (!isGroup && activeGroup?.[uniqKey] !== overGroup?.[uniqKey]) {
      const activeItems: any = itemsData?.find(
        (f: any) => f?.[uniqKey] === activeGroup?.[uniqKey]
      )?.[childKey]
      const overItems: any = itemsData?.find((f: any) => f?.[uniqKey] === overGroup?.[uniqKey])?.[
        childKey
      ]

      const activeIndex: any = activeItems?.findIndex((f: any) => f?.[uniqKey] === idx) || 0
      const overIndex: any = overItems?.findIndex((f: any) => f?.[uniqKey] === overId) || 0

      const isBelowLastItem: any = over && overIndex === overItems?.length - 1
      // && active?.rect?.current?.translated?.top > (over?.rect?.top || 0) + (over?.rect?.height || 0)
      const modifier: any = isBelowLastItem ? 1 : 0
      const newIndex = overIndex >= 0 ? overIndex + modifier : overItems?.length + 1

      const res: any = itemsData?.map((m: any) => {
        if (m?.[uniqKey] === activeGroup?.[uniqKey]) {
          m = {
            ...m,
            [childKey]: m?.[childKey]
              ?.filter((f: any) => f?.[uniqKey] !== idx)
              ?.map((group: any, groupIndex: any) => {
                group[orderKey] = groupIndex + 1
                return group
              }),
          }
        }
        if (m?.[uniqKey] === overGroup?.[uniqKey]) {
          m = {
            ...m,
            [childKey]: [
              ...m?.[childKey]?.slice(0, newIndex),
              itemsData?.find((f: any) => f?.[uniqKey] === activeGroup?.[uniqKey])?.[childKey]?.[
                activeIndex
              ],
              ...m?.[childKey]?.slice(newIndex, m?.[childKey]?.length),
            ]
              ?.filter((group: any) => group)
              ?.map((group: any, groupIndex: any) => {
                group?.[orderKey] && (group[orderKey] = groupIndex + 1)
                return group
              }),
          }
        }
        return m
      })
      over && setItemsData(res)
    }
  }

  const handleDragEnd: any = (e: any) => {
    const { active, over } = e || {}
    const { id } = active || {}
    const { id: overId } = over || {}

    const activeGroup: any = findContainer(id)
    const overGroup: any = findContainer(overId)
    const activeItem: any = activeGroup?.[childKey]?.find((f: any) => f?.[uniqKey] === id)
    const overItem: any = activeGroup?.[childKey]?.find((f: any) => f?.[uniqKey] === overId)

    if (!isGroup && activeGroup?.[uniqKey] === overGroup?.[uniqKey]) {
      const activeIndex: any = activeGroup?.[childKey]?.findIndex(
        (f: any) => activeItem?.[uniqKey] === f?.[uniqKey]
      )
      const overIndex: any = activeGroup?.[childKey]?.findIndex(
        (f: any) => overItem?.[uniqKey] === f?.[uniqKey]
      )

      if (activeIndex !== overIndex) {
        const movedArray: any = arrayMove(activeGroup?.[childKey], activeIndex, overIndex)?.map(
          (m: any, index: number) => {
            m[orderKey] = index + 1
            return m
          }
        )
        const res: any = itemsData?.map((m: any) => {
          if (m?.[uniqKey] === activeGroup?.[uniqKey]) {
            m = { ...m, [childKey]: movedArray }
          }
          return m
        })
        setItemsData(res)
      }
    } else if (isGroup && activeGroup?.[uniqKey] !== overGroup?.[uniqKey]) {
      const activeIndex: any = itemsData?.findIndex((f: any) => f?.[uniqKey] === id)
      const overIndex: any = itemsData?.findIndex((f: any) => f?.[uniqKey] === overId)
      if (activeIndex !== overIndex) {
        const res: any = arrayMove(itemsData, activeIndex, overIndex)?.map((m: any, index: any) => {
          m[orderKey] = index + 1
          return m
        })
        setItemsData(res)
      }
    }
    setActiveIdx(undefined)
    setIsgroup(false)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      modifiers={isGroup ? [(e: any) => snapTopToCursor(e, 20)] : []}
      // measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}>
      <SortableContext
        id='group'
        items={orderBy(itemsData, orderKey)?.map((ctx: any) => ctx?.[uniqKey])}>
        <div className='row mt-5'>
          {orderBy(itemsData, orderKey)?.map((m: any) => (
            <div className='col-lg-6 mb-3' key={m?.[uniqKey]}>
              <DroppableGroup data={m} />
            </div>
          ))}
          <DragOverlay
            className='p-0'
            adjustScale={false}
            dropAnimation={null}
            transition={'transform 0ms ease'}
            wrapperElement='div'>
            {activeIdx?.[uniqKey] && isGroup ? (
              <div
                className='h-100 shadow border border-dark rounded'
                style={{ transform: 'scale(0.75)' }}>
                <DroppableGroup data={activeIdx} key={activeIdx?.[uniqKey]} />
              </div>
            ) : (
              activeIdx?.[uniqKey] && (
                <Item
                  id={activeIdx?.[uniqKey]}
                  itemClass='bg-dark text-white'
                  component={<p className='m-0'>{activeIdx?.name}</p>}
                />
              )
            )}
          </DragOverlay>
        </div>
      </SortableContext>
    </DndContext>
  )
}

export default Index
