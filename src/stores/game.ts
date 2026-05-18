import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', () => {
    const player = ref({
        hp: 10,
        picks: {
            1: -1,
            2: -1,
            3: -1,
            4: -1
        },
        selected: -1
    })

    const bigBad = ref({
        boxCount: 10,
        boxes: <string[]>[],
        revealed: <number[]>[]
    })



    return { player, bigBad }
})
