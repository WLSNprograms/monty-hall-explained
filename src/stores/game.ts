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
        weaponCount: 10,
        correctWeapon: -1,
        weapons: <string[]>[],
        destroyed: <number[]>[]
    })

    function enchant() {
        for (let i = 0; i < bigBad.value.weaponCount; i++) {
            if (bigBad.value.correctWeapon === i + 1) {
                bigBad.value.weapons.push("OTKO")
            } else {
                bigBad.value.weapons.push("NORMAL")
            }
        }
    }

    function enchantOTKO() {
        if (bigBad.value.correctWeapon < 0) {
            bigBad.value.correctWeapon = Math.floor(Math.random() * bigBad.value.weaponCount + 1)
        }
    }

    function destroy(amount: number) {
        bigBad.value.weapons.map((value, index) => {
            // console.log(value, index, selected.value)
            if (value === "goat" && index !== player.value.selected && bigBad.value.destroyed.length < amount) {
                bigBad.value.destroyed.push(index)
            }
        })

        console.log(bigBad.value.destroyed)
    }

    return { player, bigBad, enchant, enchantOTKO, destroy }
})
