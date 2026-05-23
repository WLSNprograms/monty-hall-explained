<script setup lang="ts">
import { onActivated, onMounted, ref, watch } from 'vue'
import { useGameStore } from './stores/game'

const numberOfBoxes = 3
const selected = ref(-1)
const prizes = ref<string[]>([])
const correctBox = ref(0)
const revealed = ref<number[]>([])
const swapping = ref(false)
const swapped = ref(false)
const locked = ref(false)
// maybe add swap count?

// For the game portion
const gameState = useGameStore()

const phase = ref<1 | 2 | 3 | 4>(1)

function pickRandomBox() {
  correctBox.value = Math.floor(Math.random() * numberOfBoxes + 1)
}

function putPrizes() {
  for (let i = 0; i < numberOfBoxes; i++) {
    if (correctBox.value === i + 1) {
      prizes.value.push('car')
    } else {
      prizes.value.push('goat')
    }
  }
}

function reveal() {
  // This needs to pick a random one instead of just going in order
  prizes.value.map((value, index) => {
    console.log(value, index, selected.value)
    if (value === 'goat' && index !== selected.value && revealed.value.length != 1) {
      revealed.value.push(index)
    }
  })

  console.log(revealed.value)
}

onMounted(() => {
  gameState.enchantOTKO()
  gameState.enchant()
})

function setBackgroundColor(value: number): string {
  if (gameState.player.picks[1] === value - 1) {
    return "pink"
  }

  if (gameState.player.picks[2] === value - 1) {
    return "purple"
  }

  if (gameState.player.picks[3] === value - 1) {
    return "green"
  }

  if (gameState.player.picks[4] === value - 1) {
    return "gold"
  }

  return "lightgrey"
}

watch(selected, () => {
  if (!swapping.value && !swapped.value) {
    pickRandomBox()
    putPrizes()
    reveal()
  }

  if (swapping.value) {
    console.log('THEY ARE SWAPPING')
    swapped.value = true
  }
  // revealed.value = 2
})
</script>

<template>
  <h1>What is the Monty Hall Problem?</h1>
  <p>
    In 1963, the game show Let's Make A Deal was created. It's host, and co-creator, Monty Hall
    would offer traders (contestants) something of value and then give them a choice: Keep what you
    were offered initial, or risk trading trading for the <span>mystery prize</span>.
  </p>

  <p>This style of game lead professor Steve Selvin to pose the following problem:</p>
  <p>
    Suppose you are on a game show, and you must pick <span>1</span> of <span>3</span> doors. Behind
    1 door is a brand new car! Behind the other two, are goats. After you make a choice, the host
    reveals a door containing a goat and offers you a chances to switch. What do you do?
  </p>

  <h2>The Trick</h2>
  <p>
    Initially, most people believe that it's an 50/50 chance regardless of whether you switched or
    not. In reality, it's in your advantage to switch.
  </p>

  <p>
    This false assumption is because of most contestants give a sense of independence to the host
    that they do not possess. The host is <span>required</span> to open a door that has a goat. So
    by revealing a door that has one, they are giving you additional information that confirms that
    the remaining door contains the remainder of the probability from your initial guess
  </p>
  <div style="display: block; height: 50px; margin: 5px">
    <div v-bind:key='value' class="prize" v-for="value in numberOfBoxes"
      @click="selected === -1 ? (selected = value - 1) : -1"
      :style="{ backgroundColor: selected === value - 1 ? 'lightgreen' : 'lightgrey' }">
      {{ value }}
    </div>
  </div>

  <p>
    Since the host is required to pick a box that contains a goat, as the probability narrows down,
    the remaining boxes "contain" that probability. Since there were only two remaining options and
    a door was revealed, the 2/3 probability rest on the remaining box
  </p>

  <h2>The Scenario</h2>
  <p v-if="revealed[0]">
    The host hands you box {{ selected + 1 }} and then reveals that box {{ revealed[0] + 1 }} has a
    goat.
  </p>
  <div style="display: block; height: 50px; margin: 5px">
    <div v-bind:key='value' class="prize" v-for="value in numberOfBoxes"
      :style="{ backgroundColor: selected === value - 1 ? 'lightgreen' : 'lightgrey' }">
      {{ revealed.indexOf(value - 1) >= 0 ? prizes[value - 1] : '' }}
    </div>
  </div>
  <p>Now, the host gives you an offer: Keep your original box, or swap to the remaining one?</p>
  <div style="display: block; height: 50px; margin: 5px">
    <div v-bind:key='value' class="prize" v-for="value in numberOfBoxes" @click="
      () => {
        if (!swapped) {
          swapping = true
          selected !== value - 1 && revealed.indexOf(value - 1) < 0 ? (selected = value - 1) : -1
        }
      }
    " :style="{ backgroundColor: selected === value - 1 ? 'lightgreen' : 'lightgrey' }">
      {{ revealed.indexOf(value - 1) >= 0 || locked ? prizes[value - 1] : '' }}
    </div>
  </div>
  <button style="margin: 15px" @click="locked = true">REVEAL PRIZE</button>
  <p v-if="locked">
    {{ prizes[selected] === 'goat' ? 'Better luck next time.' : 'Congrats!' }} You won a
    {{ prizes[selected] }}.
  </p>

  <h2>A Stranger Example</h2>
  <p v-if='phase === 1'>
    Let's say there is a... Big Bad. And this Big Bad has {{ gameState.bigBad.weaponCount }} weapons
    in front of him, one of which can deliver a 1 hit KO. The first weapon you choose will do 10
    times the amount of damage!
  </p>
  <div style="display: block; height: 50px; margin: 5px" v-if='phase === 1'>
    <div v-bind:key='value' class="prize" v-for="value in gameState.bigBad.weaponCount" @click="
      () => {
        gameState.player.picks[1] === -1 ? (gameState.player.picks[1] = value - 1) : -1
        gameState.destroy(4)
        phase = 2
      }
    " :style="{
      backgroundColor: setBackgroundColor(value),
    }">
    </div>
  </div>
  <p v-if='phase === 2'>
    The Big Bad then destroys half of the weapons, avoiding the OHKO, leaving you with only weapons
    that can still do twice as much damage."
  </p>
  <div style="display: block; height: 50px; margin: 5px" v-if='phase === 2'>
    <div v-bind:key='value' class="prize" v-for="value in gameState.bigBad.weaponCount" @click="() => {
      if (!gameState.bigBad.destroyed.includes(value - 1) && gameState.notSelected(value - 1)) {
        gameState.player.picks[2] === -1 ? (gameState.player.picks[2] = value - 1) : -1;
        gameState.destroy(2);
        phase = 3
      }
    }" :style="{
      backgroundColor: setBackgroundColor(value),
    }">
      {{ gameState.bigBad.destroyed.indexOf(value - 1) >= 0 ? '🔪' : '' }}
    </div>
  </div>
  <p v-if='phase === 3'>
    Next, they destroy all but 3 weapons, leaving only weapons with just enough strength to do their
    base damage.
  </p>
  <div style="display: block; height: 50px; margin: 5px" v-if='phase === 3'>
    <div v-bind:key='value' class="prize" v-for="value in gameState.bigBad.weaponCount" @click="() => {
      if (!gameState.bigBad.destroyed.includes(value - 1) && gameState.notSelected(value - 1)) {
        gameState.player.picks[3] === -1 ? (gameState.player.picks[3] = value - 1) : -1
        gameState.bigBad.weapons.forEach((v: string, index: number) => {
          if (!gameState.bigBad.destroyed.includes(index) && gameState.notSelected(index)) {
            gameState.player.picks[4] = index
          }
        })
        phase = 4
      }
    }" :style="{
      backgroundColor: setBackgroundColor(value),
    }">
      {{ gameState.bigBad.destroyed.indexOf(value - 1) >= 0 ? '🔪' : '' }}
    </div>
  </div>
  <p v-if='phase === 4'>
    Finally, they destroy all but one weapon. Which weapon do you attack with?
  </p>
  <div style="display: block; height: 50px; margin: 5px" v-if='phase === 4'>
    <div v-bind:key='value' class="prize" v-for="value in gameState.player.picks" @click="() => {
      gameState.attack(value)
    }" :style="{
      backgroundColor: setBackgroundColor(value + 1),
    }">
      {{ value }}
    </div>
  </div>
  <p>You did {{ gameState.bigBad.weapons[gameState.player.selected] }} damage</p>
</template>

<style scoped>
.prize {
  background-color: lightgrey;
  display: flex;
  height: 50px;
  width: 50px;
  float: left;
  margin: 0 10px;
  justify-content: center;
  align-items: center;
}
</style>
