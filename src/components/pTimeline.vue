<template>
  <div>
    <div ref="timelineContainer"></div>
    <Popover v-if="selectedItem" ref="popover" :showCloseIcon="true" :class="popoverClass">
      <div class="flex flex-col gap-4 w-[25rem]">
        <div>
          <span class="font-medium block mb-2">{{ selectedItem.title }}</span>
          <img :src="selectedItem.image" :alt="selectedItem.title" class="w-full mb-2" />
          <InputGroup>
            <InputText :value="selectedItem.link" readonly class="w-full"></InputText>
            <InputGroupAddon>
              <i class="pi pi-external-link" @click="openLink"></i>
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div>
          <span class="font-medium block mb-2">Event Details</span>
          <ul class="list-none p-0 m-0 flex flex-col gap-2">
            <li class="flex items-center gap-2">
              <i class="pi pi-calendar"></i>
              <span>{{ formatDate(selectedItem.start) }}</span>
            </li>
            <li class="flex items-center gap-2">
              <i class="pi pi-tag"></i>
              <span>{{ selectedItem.className }}</span>
            </li>
          </ul>
        </div>
      </div>
    </Popover>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { Timeline, DataSet } from 'vis-timeline/standalone'
import 'vis-timeline/styles/vis-timeline-graph2d.css'
import Popover from 'primevue/popover'
import InputText from 'primevue/inputtext'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import { parseTimelineXML } from '../utils/xmlParser'
import { fetchXmlFile } from '../utils/fetchXml'

const timelineContainer = ref<HTMLElement | null>(null)
const popover = ref<InstanceType<typeof Popover> | null>(null)
const selectedItem = ref<any>(null)
const popoverClass = ref('')

let timeline: Timeline | null = null

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const openLink = () => {
  if (selectedItem.value.link) {
    window.open(selectedItem.value.link, '_blank')
  }
}

const showPopover = (event: MouseEvent) => {
  if (popover.value) {
    const rect = timelineContainer.value!.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    popoverClass.value = `absolute left-[${x}px] top-[${y}px]`
    nextTick(() => {
      popover.value!.show(event)
    })
  }
}

onMounted(async () => {
  if (timelineContainer.value) {
    try {
      console.log('Fetching XML file...')
      const xmlData = await fetchXmlFile('/event.xml')
      console.log('XML data fetched, length:', xmlData.length)

      console.log('Parsing XML data...')
      const items = parseTimelineXML(xmlData)
      console.log('Parsed items:', items)

      if (items.length === 0) {
        console.error('No items parsed from XML')
        return
      }

      const dataset = new DataSet(items)

      console.log('Creating timeline...')
      timeline = new Timeline(timelineContainer.value, dataset, {
        start: items[0].start,
        end: items[items.length - 1].start,
        height: '500px'
      })

      timeline.on('click', (properties) => {
        if (properties.item) {
          const clickedItem = dataset.get(properties.item)
          if (clickedItem) {
            selectedItem.value = clickedItem
            console.log('Clicked item:', clickedItem)
            showPopover(properties.event)
          }
        }
      })

      console.log('Timeline created successfully')
    } catch (error) {
      console.error('Error loading timeline data:', error)
    }
  }
})

onBeforeUnmount(() => {
  if (timeline) {
    timeline.destroy()
  }
})
</script>

<style scoped>
.timeline-wrapper {
  width: 800px; /* or any desired width */
  height: 400px; /* or any desired height */
  overflow: hidden; /* This will hide any overflow */
}

/* Ensure the timeline fits within the wrapper */
:deep(.vis-timeline) {
  width: 100%;
  height: 100%;
}

.p-inputgroup-addon {
  cursor: pointer;
}
</style>
