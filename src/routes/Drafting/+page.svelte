<script>
	import { flip } from 'svelte/animate';
	import { send, receive } from './transition.js';
    import "../../app.css";
    import Layout from '../Layout.svelte';
    import { fly } from 'svelte/transition';
    import { json } from '@sveltejs/kit';
    import { onMount } from 'svelte';
    import Select from 'svelte-select';
    import loadOptions from './tricodes.js'
    
	let DraftStack = [
		{
			name: 'BB1',
			items: [["Blank", 0]]
		},
        {
			name: 'BB2',
			items: [["Blank", 0]]
		},
        {
			name: 'BB3',
			items: [["Blank", 0]]
		},
        {
			name: 'BB4',
			items: [["Blank", 0]]
		},
        {
			name: 'BB5',
			items: [["Blank", 0]]
		},
		{
			name: 'RB1',
			items: [["Blank", 0]]
		},
        {
			name: 'RB2',
			items: [["Blank", 0]]
		},
        {
			name: 'RB3',
			items: [["Blank", 0]]
		},
        {
			name: 'RB4',
			items: [["Blank", 0]]
		},
        {
			name: 'RB5',
			items: [["Blank", 0]]
		},
        {
			name: 'BP1',
			items: [["Blank", 0]]
		},
        {
			name: 'BP2',
			items: [["Blank", 0]]
		},
        {
			name: 'BP3',
			items: [["Blank", 0]]
		},
        {
			name: 'BP4',
			items: [["Blank", 0]]
		},
        {
			name: 'BP5',
			items: [["Blank", 0]]
		},
		{
			name: 'RP1',
			items: [["Blank", 0]]
		},
        {
			name: 'RP2',
			items: [["Blank", 0]]
		},
        {
			name: 'RP3',
			items: [["Blank", 0]]
		},
        {
			name: 'RP4',
			items: [["Blank", 0]]
		},
        {
			name: 'RP5',
			items: [["Blank", 0]]
		},
        {
            name: "Champs",
            items: []
        }
	];

    async function main(){
        let champions = await fetchAsync("http://ddragon.leagueoflegends.com/cdn/13.18.1/data/en_US/champion.json")
        let champNames = Object.keys(champions["data"])
        let i = 0
        while (i < Object.keys(champions["data"]).length) {
            DraftStack[20].items.push([champions["data"][champNames[i]]["key"],champNames[i]]);
            i++
        }
    }

    
    async function fetchAsync (url) {
        let response = (await fetch(url)).json();
        return response;
    }


	let stackHover;

	function dragStart(event, stackIndex, itemIndex) {
		const data = { stackIndex, itemIndex };
		event.dataTransfer.setData('text/plain', JSON.stringify(data));
	}

    function Comparator(a, b) {
            if (a[1] < b[1]) return -1;
            if (a[1] > b[1]) return 1;
            return 0;
        }

	function drop(event, stackIndex) {
        if (stackIndex != 20){    
                event.preventDefault();
                const json = event.dataTransfer.getData('text/plain');
                const data = JSON.parse(json);
                const [item] = DraftStack[data.stackIndex].items.splice(data.itemIndex, 1);      
                if (DraftStack[stackIndex].items[0][0] == "Blank") {
                    DraftStack[stackIndex].items[0] = item;
                    if (data.stackIndex != 20) {
                        DraftStack[data.stackIndex].items[0] = ["Blank", 0]
                    }
                    DraftStack = DraftStack;
                    stackHover = null;   
                }
                else{
                    const tempStorage = DraftStack[stackIndex].items[0]
                    DraftStack[stackIndex].items[0] = item
                    DraftStack[data.stackIndex].items.push(tempStorage)
                    DraftStack = DraftStack;
                    stackHover = null;  
                }       
        }
        else {
            event.preventDefault();
            const json = event.dataTransfer.getData('text/plain');
            const data = JSON.parse(json);
            const [item] = DraftStack[data.stackIndex].items.splice(data.itemIndex, 1);
            if (item[0] != "Blank") {
                DraftStack[stackIndex].items.push(item)
            }
            DraftStack[data.stackIndex].items[0] = (["Blank", 0])
            DraftStack = DraftStack;
            stackHover = null;
                
            }
        DraftStack[20].items.sort(Comparator)
	}
    let name = "";
    let opponent = "";

    async function submit(){
        let url = "/Drafting/Create"
        console.log(JSON.stringify({DraftStack, name, opponent}))
        await fetch(url, {
            method: 'POST',
            body: JSON.stringify({DraftStack, name, opponent})

        })
        location.reload()
    }

    const itemId = 'id';
    const label = 'code';

</script>
<main class = "bg-slate-800 flex h-full flex-row overflow-auto w-auto">
    <Layout/>
    <div class="h-fit scroll flex flex-col px-4 mt-4 w-5/6">
        <div class="h-28 scroll flex flex-row w-full scrollbar-hide pb-4">
            <div class = "w-4/6 h-full ">
                <input id="draftName" bind:value={name} placeholder=" Draft Name" class="w-full font-bold text-6xl rounded-md bg-slate-600 hover:bg-white">
            </div>
            <div class = "w-1/6 h-full ml-4">
                <Select id="tag" {loadOptions} {itemId} {label} placeholder="TriCode" bind:value={opponent} class ="h-[85px] text-6xl bg-slate-600" ></Select>
            </div>
            <div class = "w-1/6">
                <button class="w-5/6 h-[85px] ml-4 rounded-md font-bold text-6xl bg-slate-600 hover:bg-white text-slate-400" on:click={submit}>
                    Save
                </button>
            </div>
        </div>
        <div class="h-28 scroll flex flex-row w-full scrollbar-hide pb-4">
            <div class = "h-full w-1/2 bg-blue-700 flex flex-row items-center">
                <div class = "h-20 w-20 m-4" in:receive={{ key: 0 }} out:send={{ key: 0}}>
                    <p
                        class:hovering={stackHover === DraftStack[0].name}
                        on:dragenter={() => (stackHover = DraftStack[0].name)}
                        on:dragleave={() => (stackHover = null)}
                        on:drop={(event) => drop(event, 0)}
                        ondragover="return false"
                    >
                    {#each DraftStack[0].items as item, itemIndex (item)}
                            <div class = "h-20 w-20  ">
                                <li class = "h-20 w-20  bg-slate-600"draggable={true} on:dragstart={(event) => dragStart(event, 0, itemIndex)}>
                                    {#if item[0] != "Blank"}
                                        <img class = "grayscale hover:grayscale-0" src="./champIcons/{item[0]}.webp
                                        " alt="" in:fly>
                                    {/if}
                                </li>
                            </div>
                    {/each}
                    </p>
                </div>
                <div class = "h-20 w-20 mr-4" in:receive={{ key: 1 }} out:send={{ key: 1}}>
                    <p
                        class:hovering={stackHover === DraftStack[1].name}
                        on:dragenter={() => (stackHover = DraftStack[1].name)}
                        on:dragleave={() => (stackHover = null)}
                        on:drop={(event) => drop(event, 1)}
                        ondragover="return false"
                    >
                    {#each DraftStack[1].items as item, itemIndex (item)}
                            <div class = "h-20 w-20  ">
                                <li class = "h-20 w-20  bg-slate-600"draggable={true} on:dragstart={(event) => dragStart(event, 1, itemIndex)}>
                                    {#if item[0] != "Blank"}
                                        <img class = "grayscale hover:grayscale-0" src="./champIcons/{item[0]}.webp
                                        " alt="" in:fly>
                                    {/if}
                                </li>
                            </div>
                    {/each}
                    </p>
                </div>
                <div class = "h-20 w-20 mr-12" in:receive={{ key: 2 }} out:send={{ key: 2}}>
                    <p
                        class:hovering={stackHover === DraftStack[2].name}
                        on:dragenter={() => (stackHover = DraftStack[2].name)}
                        on:dragleave={() => (stackHover = null)}
                        on:drop={(event) => drop(event, 2)}
                        ondragover="return false"
                    >
                    {#each DraftStack[2].items as item, itemIndex (item)}
                            <div class = "h-20 w-20  ">
                                <li class = "h-20 w-20  bg-slate-600"draggable={true} on:dragstart={(event) => dragStart(event, 2, itemIndex)}>
                                    {#if item[0] != "Blank"}
                                        <img class = "grayscale hover:grayscale-0" src="./champIcons/{item[0]}.webp
                                        " alt="" in:fly>
                                    {/if}
                                </li>
                            </div>
                    {/each}
                    </p>
                </div>
                <div class = "h-20 w-20 mr-4" in:receive={{ key: 3 }} out:send={{ key: 3}}>
                    <p
                        class:hovering={stackHover === DraftStack[3].name}
                        on:dragenter={() => (stackHover = DraftStack[3].name)}
                        on:dragleave={() => (stackHover = null)}
                        on:drop={(event) => drop(event, 3)}
                        ondragover="return false"
                    >
                    {#each DraftStack[3].items as item, itemIndex (item)}
                            <div class = "h-20 w-20  ">
                                <li class = "h-20 w-20  bg-slate-600"draggable={true} on:dragstart={(event) => dragStart(event, 3, itemIndex)}>
                                    {#if item[0] != "Blank"}
                                        <img class = "grayscale hover:grayscale-0" src="./champIcons/{item[0]}.webp
                                        " alt="" in:fly>
                                    {/if}
                                </li>
                            </div>
                    {/each}
                    </p>
                </div>
                <div class = "h-20 w-20 mr-4" in:receive={{ key: 4 }} out:send={{ key: 4}}>
                    <p
                        class:hovering={stackHover === DraftStack[4].name}
                        on:dragenter={() => (stackHover = DraftStack[4].name)}
                        on:dragleave={() => (stackHover = null)}
                        on:drop={(event) => drop(event, 4)}
                        ondragover="return false"
                    >
                    {#each DraftStack[4].items as item, itemIndex (item)}
                            <div class = "h-20 w-20  ">
                                <li class = "h-20 w-20  bg-slate-600"draggable={true} on:dragstart={(event) => dragStart(event, 4, itemIndex)}>
                                    {#if item[0] != "Blank"}
                                        <img class = "grayscale hover:grayscale-0" src="./champIcons/{item[0]}.webp
                                        " alt="" in:fly>
                                    {/if}
                                </li>
                            </div>
                    {/each}
                    </p>
                </div>
            </div>
            <div class = "h-full w-1/2 bg-red-700 flex flex-row-reverse items-center">
                <div class = "h-20 w-20 m-4" in:receive={{ key: 5 }} out:send={{ key: 5}}>
                    <p
                        class:hovering={stackHover === DraftStack[5].name}
                        on:dragenter={() => (stackHover = DraftStack[5].name)}
                        on:dragleave={() => (stackHover = null)}
                        on:drop={(event) => drop(event, 5)}
                        ondragover="return false"
                    >
                    {#each DraftStack[5].items as item, itemIndex (item)}
                            <div class = "h-20 w-20  ">
                                <li class = "h-20 w-20  bg-slate-600"draggable={true} on:dragstart={(event) => dragStart(event, 5, itemIndex)}>
                                    {#if item[0] != "Blank"}
                                        <img class = "grayscale hover:grayscale-0" src="./champIcons/{item[0]}.webp
                                        " alt="" in:fly>
                                    {/if}
                                </li>
                            </div>
                    {/each}
                    </p>
                </div>
                <div class = "h-20 w-20 ml-4" in:receive={{ key: 6 }} out:send={{ key: 6}}>
                    <p
                        class:hovering={stackHover === DraftStack[6].name}
                        on:dragenter={() => (stackHover = DraftStack[6].name)}
                        on:dragleave={() => (stackHover = null)}
                        on:drop={(event) => drop(event, 6)}
                        ondragover="return false"
                    >
                    {#each DraftStack[6].items as item, itemIndex (item)}
                            <div class = "h-20 w-20  ">
                                <li class = "h-20 w-20  bg-slate-600"draggable={true} on:dragstart={(event) => dragStart(event, 6, itemIndex)}>
                                    {#if item[0] != "Blank"}
                                        <img class = "grayscale hover:grayscale-0" src="./champIcons/{item[0]}.webp
                                        " alt="" in:fly>
                                    {/if}
                                </li>
                            </div>
                    {/each}
                    </p>
                </div>
                <div class = "h-20 w-20 ml-12" in:receive={{ key: 7 }} out:send={{ key: 7}}>
                    <p
                        class:hovering={stackHover === DraftStack[7].name}
                        on:dragenter={() => (stackHover = DraftStack[0].name)}
                        on:dragleave={() => (stackHover = null)}
                        on:drop={(event) => drop(event, 7)}
                        ondragover="return false"
                    >
                    {#each DraftStack[7].items as item, itemIndex (item)}
                            <div class = "h-20 w-20  ">
                                <li class = "h-20 w-20  bg-slate-600"draggable={true} on:dragstart={(event) => dragStart(event, 7, itemIndex)}>
                                    {#if item[0] != "Blank"}
                                        <img class = "grayscale hover:grayscale-0" src="./champIcons/{item[0]}.webp
                                        " alt="" in:fly>
                                    {/if}
                                </li>
                            </div>
                    {/each}
                    </p>
                </div>
                <div class = "h-20 w-20 ml-4" in:receive={{ key: 8 }} out:send={{ key: 8}}>
                    <p
                        class:hovering={stackHover === DraftStack[8].name}
                        on:dragenter={() => (stackHover = DraftStack[8].name)}
                        on:dragleave={() => (stackHover = null)}
                        on:drop={(event) => drop(event, 8)}
                        ondragover="return false"
                    >
                    {#each DraftStack[8].items as item, itemIndex (item)}
                            <div class = "h-20 w-20  ">
                                <li class = "h-20 w-20  bg-slate-600"draggable={true} on:dragstart={(event) => dragStart(event, 8, itemIndex)}>
                                    {#if item[0] != "Blank"}
                                        <img class = "grayscale hover:grayscale-0" src="./champIcons/{item[0]}.webp
                                        " alt="" in:fly>
                                    {/if}
                                </li>
                            </div>
                    {/each}
                    </p>
                </div>
                <div class = "h-20 w-20 ml-4" in:receive={{ key: 9 }} out:send={{ key: 9}}>
                    <p
                        class:hovering={stackHover === DraftStack[9].name}
                        on:dragenter={() => (stackHover = DraftStack[9].name)}
                        on:dragleave={() => (stackHover = null)}
                        on:drop={(event) => drop(event, 9)}
                        ondragover="return false"
                    >
                    {#each DraftStack[9].items as item, itemIndex (item)}
                            <div class = "h-20 w-20  ">
                                <li class = "h-20 w-20  bg-slate-600"draggable={true} on:dragstart={(event) => dragStart(event, 9, itemIndex)}>
                                    {#if item[0] != "Blank"}
                                        <img class = "grayscale hover:grayscale-0" src="./champIcons/{item[0]}.webp
                                        " alt="" in:fly>
                                    {/if}
                                </li>
                            </div>
                    {/each}
                    </p>
                </div>
            </div>
        </div>
        <div class = "w-full h-[700px] flex flex-row">
            <div class = "w-1/5 h-full flex flex-col">
                <div class = "h-28 w-full mb-4 flex place-content-center" in:receive={{ key: 10}} out:send={{ key: 10}}>
                    <p
                        class:hovering={stackHover === DraftStack[10].name}
                        on:dragenter={() => (stackHover = DraftStack[10].name)}
                        on:dragleave={() => (stackHover = null)}
                        on:drop={(event) => drop(event, 10)}
                        ondragover="return false"
                    >
                    {#each DraftStack[10].items as item, itemIndex (item)}
                            <div class = "h-28 w-28">
                                <li class = "h-28 w-28  bg-slate-600"draggable={true} on:dragstart={(event) => dragStart(event, 10, itemIndex)}>
                                    {#if item[0] != "Blank"}
                                        <img class = "grayscale hover:grayscale-0" src="./champIcons/{item[0]}.webp
                                        " alt="" in:fly>
                                    {/if}
                                </li>
                            </div>
                    {/each}
                    </p>
                </div>
                <div class = "h-28 w-full mb-4 flex place-content-center" in:receive={{ key: 11}} out:send={{ key: 11}}>
                    <p
                        class:hovering={stackHover === DraftStack[11].name}
                        on:dragenter={() => (stackHover = DraftStack[11].name)}
                        on:dragleave={() => (stackHover = null)}
                        on:drop={(event) => drop(event, 11)}
                        ondragover="return false"
                    >
                    {#each DraftStack[11].items as item, itemIndex (item)}
                            <div class = "h-28 w-28">
                                <li class = "h-28 w-28  bg-slate-600"draggable={true} on:dragstart={(event) => dragStart(event, 11, itemIndex)}>
                                    {#if item[0] != "Blank"}
                                        <img class = "grayscale hover:grayscale-0" src="./champIcons/{item[0]}.webp
                                        " alt="" in:fly>
                                    {/if}
                                </li>
                            </div>
                    {/each}
                    </p>
                </div>
                <div class = "h-28 w-full mb-12 flex place-content-center" in:receive={{ key: 12}} out:send={{ key: 12}}>
                    <p
                        class:hovering={stackHover === DraftStack[12].name}
                        on:dragenter={() => (stackHover = DraftStack[12].name)}
                        on:dragleave={() => (stackHover = null)}
                        on:drop={(event) => drop(event, 12)}
                        ondragover="return false"
                    >
                    {#each DraftStack[12].items as item, itemIndex (item)}
                            <div class = "h-28 w-28">
                                <li class = "h-28 w-28  bg-slate-600"draggable={true} on:dragstart={(event) => dragStart(event, 12, itemIndex)}>
                                    {#if item[0] != "Blank"}
                                        <img class = "grayscale hover:grayscale-0" src="./champIcons/{item[0]}.webp
                                        " alt="" in:fly>
                                    {/if}
                                </li>
                            </div>
                    {/each}
                    </p>
                </div>
                <div class = "h-28 w-full mb-4 flex place-content-center" in:receive={{ key: 13}} out:send={{ key: 13}}>
                    <p
                        class:hovering={stackHover === DraftStack[13].name}
                        on:dragenter={() => (stackHover = DraftStack[13].name)}
                        on:dragleave={() => (stackHover = null)}
                        on:drop={(event) => drop(event, 13)}
                        ondragover="return false"
                    >
                    {#each DraftStack[13].items as item, itemIndex (item)}
                            <div class = "h-28 w-28">
                                <li class = "h-28 w-28  bg-slate-600"draggable={true} on:dragstart={(event) => dragStart(event, 13, itemIndex)}>
                                    {#if item[0] != "Blank"}
                                        <img class = "grayscale hover:grayscale-0" src="./champIcons/{item[0]}.webp
                                        " alt="" in:fly>
                                    {/if}
                                </li>
                            </div>
                    {/each}
                    </p>
                </div>
                <div class = "h-28 w-full mb-4 flex place-content-center" in:receive={{ key: 14}} out:send={{ key: 14}}>
                    <p
                        class:hovering={stackHover === DraftStack[14].name}
                        on:dragenter={() => (stackHover = DraftStack[14].name)}
                        on:dragleave={() => (stackHover = null)}
                        on:drop={(event) => drop(event, 14)}
                        ondragover="return false"
                    >
                    {#each DraftStack[14].items as item, itemIndex (item)}
                            <div class = "h-28 w-28">
                                <li class = "h-28 w-28  bg-slate-600"draggable={true} on:dragstart={(event) => dragStart(event, 14, itemIndex)}>
                                    {#if item[0] != "Blank"}
                                        <img class = "grayscale hover:grayscale-0" src="./champIcons/{item[0]}.webp
                                        " alt="" in:fly>
                                    {/if}
                                </li>
                            </div>
                    {/each}
                    </p>
                </div>
            </div>
            <div class = "w-3/5 h-full">
                <div class = "w-full h-12">

                </div>
                <div class = "w-full h-5/6 overflow-y-auto " in:receive={{ key: 20 }} out:send={{ key: 20}}>
                    <p
                        class:hovering={stackHover === DraftStack[20].name}
                        on:dragenter={() => (stackHover = DraftStack[20].name)}
                        on:dragleave={() => (stackHover = null)}
                        on:drop={(event) => drop(event, 20)}
                        ondragover="return false"
                        class = "w-full h-full flex flex-wrap flex-row"
                    >
                    {#await main() then data}
                        {#each DraftStack[20].items as item, itemIndex (item)}
                            <div class = "h-24 m-2 w-24 grid-item p-0 ">
                                <li class = "h-24 w-24  bg-slate-600"draggable={true} on:dragstart={(event) => dragStart(event, 20, itemIndex)}>
                                    <img class = "grayscale hover:grayscale-0" src="./champIcons/{item[0]}.webp
									" alt="" in:fly>
                                </li>
                            </div>
                        {/each}
                    {/await}
                    </p>
                </div>
            </div>
            <div class = "w-1/5 h-full flex flex-col">
                <div class = "h-28 w-full mb-4 flex place-content-center" in:receive={{ key: 15}} out:send={{ key: 15}}>
                    <p
                        class:hovering={stackHover === DraftStack[15].name}
                        on:dragenter={() => (stackHover = DraftStack[15].name)}
                        on:dragleave={() => (stackHover = null)}
                        on:drop={(event) => drop(event, 15)}
                        ondragover="return false"
                    >
                    {#each DraftStack[15].items as item, itemIndex (item)}
                            <div class = "h-28 w-28">
                                <li class = "h-28 w-28  bg-slate-600"draggable={true} on:dragstart={(event) => dragStart(event, 15, itemIndex)}>
                                    {#if item[0] != "Blank"}
                                        <img class = "grayscale hover:grayscale-0" src="./champIcons/{item[0]}.webp
                                        " alt="" in:fly>
                                    {/if}
                                </li>
                            </div>
                    {/each}
                    </p>
                </div>
                <div class = "h-28 w-full mb-4 flex place-content-center" in:receive={{ key: 16}} out:send={{ key: 16}}>
                    <p
                        class:hovering={stackHover === DraftStack[16].name}
                        on:dragenter={() => (stackHover = DraftStack[16].name)}
                        on:dragleave={() => (stackHover = null)}
                        on:drop={(event) => drop(event, 16)}
                        ondragover="return false"
                    >
                    {#each DraftStack[16].items as item, itemIndex (item)}
                            <div class = "h-28 w-28">
                                <li class = "h-28 w-28  bg-slate-600"draggable={true} on:dragstart={(event) => dragStart(event, 16, itemIndex)}>
                                    {#if item[0] != "Blank"}
                                        <img class = "grayscale hover:grayscale-0" src="./champIcons/{item[0]}.webp
                                        " alt="" in:fly>
                                    {/if}
                                </li>
                            </div>
                    {/each}
                    </p>
                </div>
                <div class = "h-28 w-full mb-12 flex place-content-center" in:receive={{ key: 17}} out:send={{ key: 17}}>
                    <p
                        class:hovering={stackHover === DraftStack[17].name}
                        on:dragenter={() => (stackHover = DraftStack[17].name)}
                        on:dragleave={() => (stackHover = null)}
                        on:drop={(event) => drop(event, 17)}
                        ondragover="return false"
                    >
                    {#each DraftStack[17].items as item, itemIndex (item)}
                            <div class = "h-28 w-28">
                                <li class = "h-28 w-28  bg-slate-600"draggable={true} on:dragstart={(event) => dragStart(event, 17, itemIndex)}>
                                    {#if item[0] != "Blank"}
                                        <img class = "grayscale hover:grayscale-0" src="./champIcons/{item[0]}.webp
                                        " alt="" in:fly>
                                    {/if}
                                </li>
                            </div>
                    {/each}
                    </p>
                </div>
                <div class = "h-28 w-full mb-4 flex place-content-center" in:receive={{ key: 18}} out:send={{ key: 18}}>
                    <p
                        class:hovering={stackHover === DraftStack[18].name}
                        on:dragenter={() => (stackHover = DraftStack[18].name)}
                        on:dragleave={() => (stackHover = null)}
                        on:drop={(event) => drop(event, 18)}
                        ondragover="return false"
                    >
                    {#each DraftStack[18].items as item, itemIndex (item)}
                            <div class = "h-28 w-28">
                                <li class = "h-28 w-28  bg-slate-600"draggable={true} on:dragstart={(event) => dragStart(event, 18, itemIndex)}>
                                    {#if item[0] != "Blank"}
                                        <img class = "grayscale hover:grayscale-0" src="./champIcons/{item[0]}.webp
                                        " alt="" in:fly>
                                    {/if}
                                </li>
                            </div>
                    {/each}
                    </p>
                </div>
                <div class = "h-28 w-full mb-4 flex place-content-center" in:receive={{ key: 19}} out:send={{ key: 19}}>
                    <p
                        class:hovering={stackHover === DraftStack[19].name}
                        on:dragenter={() => (stackHover = DraftStack[19].name)}
                        on:dragleave={() => (stackHover = null)}
                        on:drop={(event) => drop(event, 19)}
                        ondragover="return false"
                    >
                    {#each DraftStack[19].items as item, itemIndex (item)}
                            <div class = "h-28 w-28">
                                <li class = "h-28 w-28  bg-slate-600"draggable={true} on:dragstart={(event) => dragStart(event, 19, itemIndex)}>
                                    {#if item[0] != "Blank"}
                                        <img class = "grayscale hover:grayscale-0" src="./champIcons/{item[0]}.webp
                                        " alt="" in:fly>
                                    {/if}
                                </li>
                            </div>
                    {/each}
                    </p>
                </div>
        </div>
    </div> 
    <div class = "h-8 bg-slate-600 flex">
        <div>opponent</div>
        <div>name</div>
        <div>Blue Bans</div>
        <div>Red Bans</div>
        <div>Blue Picks</div>
        <div>Red Picks</div>
    </div>
</main>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

<style>

    li {
        cursor: pointer;
        display: inline-block;
    }
</style>

