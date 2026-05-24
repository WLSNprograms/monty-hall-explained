import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', () => {
  const story = ["", "", "", ""]
  const player = ref({
    hp: 10,
    picks: {
      1: -1,
      2: -1,
      3: -1,
      4: -1,
    },
    selected: -1,
  })

  const bigBad = ref({
    weaponCount: 10,
    correctWeapon: -1,
    weapons: <string[]>[],
    destroyed: <number[]>[],
  })

  function enchant() {
    for (let i = 0; i < bigBad.value.weaponCount; i++) {
      if (bigBad.value.correctWeapon === i + 1) {
        bigBad.value.weapons.push('OTKO')
      } else {
        bigBad.value.weapons.push('NORMAL')
      }
    }
  }

  function enchantOTKO() {
    if (bigBad.value.correctWeapon < 0) {
      bigBad.value.correctWeapon = Math.floor(Math.random() * bigBad.value.weaponCount + 1)
    }
  }

  function notSelected(index: number): boolean {
    if (
      player.value.picks[1] === index ||
      player.value.picks[2] === index ||
      player.value.picks[3] === index ||
      player.value.picks[4] === index
    ) {
      return false
    }
    return true
  }

  function destroy(amount: number) {
    let destroyCount = 0
    bigBad.value.weapons.map((value, index) => {
      // console.log(value, index, selected.value)
      if (
        value === 'NORMAL' &&
        notSelected(index) &&
        destroyCount < amount &&
        !bigBad.value.destroyed.includes(index)
      ) {
        console.log("oioioi")
        bigBad.value.destroyed.push(index)
        destroyCount += 1
      }
    })

    console.log(bigBad.value.destroyed)
  }

  function attack(value: number) {
    // prizes.value.map((value, index) => {
    //     console.log(value, index, selected.value)
    //     if (value === 'goat' && index !== selected.value && revealed.value.length != 1) {
    //       revealed.value.push(index)
    //     }
    //   })

    //   console.log(revealed.value)
    player.value.selected = value
    console.log(value)
  }

  function reset() {

  }

  return { player, bigBad, enchant, enchantOTKO, destroy, notSelected, attack, reset }
})
