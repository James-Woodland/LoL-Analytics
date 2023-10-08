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
    import {CircleArrowDownSolid} from "svelte-awesome-icons"

    let Drafts = [];
    
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
        },
        {
            name: "allChamps",
            items: []
        }
	];

    async function main(){
        let champions = await fetchAsync("http://ddragon.leagueoflegends.com/cdn/13.18.1/data/en_US/champion.json")
        let champNames = Object.keys(champions["data"])
        let i = 0
        while (i < Object.keys(champions["data"]).length) {
            DraftStack[20].items.push([champions["data"][champNames[i]]["key"],champNames[i]]);
            DraftStack[21].items.push([champions["data"][champNames[i]]["key"],champNames[i]]);
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
        console.log(stackIndex)
        if (stackIndex != 20){    
                event.preventDefault();
                const json = event.dataTransfer.getData('text/plain');
                const data = JSON.parse(json);
                const [item] = DraftStack[data.stackIndex].items.splice(data.itemIndex, 1);      
                if (DraftStack[stackIndex].items[0][0] == "Blank") {
                    DraftStack[stackIndex].items[0] = item;
                    console.log(data.stackIndex)
                    if (data.stackIndex != 20) {
                        console.log("fuck")
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
        filterChamps()
        DraftStack[20].items.sort(Comparator)
        DraftStack[21].items = DraftStack[21].items
        DraftStack[21].items.sort(Comparator)
        console.log(DraftStack)
	}
    let name = "";
    let opponent = "";

    async function submit(){
        if (draftId == 0){
            let url = "/Drafting/Create"
            await fetch(url, {
                method: 'POST',
                body: JSON.stringify({DraftStack, name, opponent})
            })
        }
        else{
            let url = "/Drafting/Edit"
            await fetch(url, {
                method: 'PUT',
                body: JSON.stringify({draftId, DraftStack, name, opponent})
            })
        }
        location.reload()
    }
    let champList;
    let tricodes = [];
    let filteredDrafts = [];
    onMount(() => {
        async function load(){

            let response = await fetchAsync("/Drafting/AllDrafts")
            for (let index = 0; index < response.length; index++) {
                Drafts.push(response[index]);   
            }
            Drafts = Drafts;
            filteredDrafts = Drafts;

            response = await fetchAsync("/Drafting/Tricodes")
            for (let index = 0; index < response.length; index++) {
                tricodes.push(response[index]);   
            }
            tricodes = tricodes;
        }
        load();


    });

    const itemId = 'id';
    const label = 'code';

    let draftId = 0;

    async function loadDraft(){
        let response = await fetchAsync("/Drafting/"+this.id)
        let responseKeys = Object.keys(response)
        let excludedChamps = [];
        for (let i = 0; i < responseKeys.length; i++) {
            if  (!["draftid","opponentid","name","opponent"].includes(responseKeys[i])){
                if (response[responseKeys[i]] != "Blank"){
                    excludedChamps.push(response[responseKeys[i]])
                }
            }   
        }
        DraftStack[20].items = []
        DraftStack[21].items = []
        let champions = await fetchAsync("http://ddragon.leagueoflegends.com/cdn/13.18.1/data/en_US/champion.json")
        let champNames = Object.keys(champions["data"])
        let champNamesDict = {}
        for (let i = 0; i < champNames.length; i++) {
            if (!excludedChamps.includes(String(champions["data"][champNames[i]]["key"]))){
                DraftStack[20].items.push([champions["data"][champNames[i]]["key"],champNames[i]]);
                DraftStack[21].items.push([champions["data"][champNames[i]]["key"],champNames[i]]);
            }
            champNamesDict[champions["data"][champNames[i]]["key"]] = champNames[i]
        }
        console.log(response)
        champNamesDict["Blank"] = 0
        DraftStack[0].items[0] = [response.bb1, champNamesDict[response.bb1]]
        DraftStack[1].items[0] = [response.bb2, champNamesDict[response.bb2]]
        DraftStack[2].items[0] = [response.bb3, champNamesDict[response.bb3]]
        DraftStack[3].items[0] = [response.bb4, champNamesDict[response.bb4]]
        DraftStack[4].items[0] = [response.bb5, champNamesDict[response.bb5]]
        DraftStack[5].items[0] = [response.rb1, champNamesDict[response.rb1]]
        DraftStack[6].items[0] = [response.rb2, champNamesDict[response.rb2]]
        DraftStack[7].items[0] = [response.rb3, champNamesDict[response.rb3]]
        DraftStack[8].items[0] = [response.rb4, champNamesDict[response.rb4]]
        DraftStack[9].items[0] = [response.rb5, champNamesDict[response.rb5]]
        DraftStack[10].items[0] = [response.bp1, champNamesDict[response.bp1]]
        DraftStack[11].items[0] = [response.bp2, champNamesDict[response.bp2]]
        DraftStack[12].items[0] = [response.bp3, champNamesDict[response.bp3]]
        DraftStack[13].items[0] = [response.bp4, champNamesDict[response.bp4]]
        DraftStack[14].items[0] = [response.bp5, champNamesDict[response.bp5]]
        DraftStack[15].items[0] = [response.rp1, champNamesDict[response.rp1]]
        DraftStack[16].items[0] = [response.rp2, champNamesDict[response.rp2]]
        DraftStack[17].items[0] = [response.rp3, champNamesDict[response.rp3]]
        DraftStack[18].items[0] = [response.rp4, champNamesDict[response.rp4]]
        DraftStack[19].items[0] = [response.rp5, champNamesDict[response.rp5]]
        draftId = response.draftid
        name = response.name
        opponent = response.opponent.id
        opponent = opponent
        console.log(opponent)
        //document.getElementById('tag').value = opponent
        console.log(document.getElementById('tag').value)
    }
    let draftTriFilter = ""
    let draftNameFilter = ""
    let champFilter = ""

    function filterDrafts(){
        console.log(draftTriFilter)
        filteredDrafts = Drafts.filter(Draft => Draft.name.toUpperCase().includes(draftNameFilter.toUpperCase()))
        filteredDrafts = filteredDrafts.filter(Draft => Draft.opponent.code.includes(draftTriFilter.toUpperCase()))
        filteredDrafts = filteredDrafts
    }

    function filterChamps(){
        console.log(champFilter)
        console.log(DraftStack[20].items)
        DraftStack[21].items = DraftStack[20].items.filter(champ => champ[1].toUpperCase().startsWith(champFilter.toUpperCase()))
        DraftStack[21].items = DraftStack[21].items
        console.log(DraftStack[21].items)
    }


</script>
<main class = "bg-slate-800 flex h-full flex-row overflow-auto w-auto">
    <Layout/>
    <div class="h-fit scroll flex flex-col px-4 mt-4 w-5/6">
        <div class="h-28 scroll flex flex-row w-full scrollbar-hide pb-4">
            <div class = "w-4/6 h-full">
                <input id="draftName" bind:value={name} placeholder=" Draft Name" class="w-full font-bold text-6xl rounded-md bg-slate-600 hover:bg-white">
            </div>
            <div class = "w-1/6 h-full ml-4">
                {#if tricodes != []}
                    <Select id="tag" items={tricodes} {itemId} {label} placeholder="Tricode" bind:value={opponent} class ="h-[85px] text-6xl bg-slate-600" ></Select>
                {/if}
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
                    <div class = "h-full w-1/3 ml-2 rounded-lg">
                        <input bind:value={champFilter} placeholder=" Champion Name" class="w-full h-10 text-lg font-bold rounded-md bg-slate-600 hover:bg-white" on:input={filterChamps}>
                    </div>
                </div>
                <div class = "w-full h-5/6 overflow-y-auto " in:receive={{ key: 20 }} out:send={{ key: 20}}>
                    <p
                        class:hovering={stackHover === DraftStack[20].name}
                        on:dragenter={() => (stackHover = DraftStack[20].name)}
                        on:dragleave={() => (stackHover = null)}
                        on:drop={(event) => drop(event, 20)}
                        ondragover="return false"
                        class = "w-full h-fit flex flex-wrap flex-row space-y-2"
                    >
                    {#await main() then data}
                        {#each DraftStack[21].items as item, itemIndex (item)}
                            <div class = "h-24 m-2 w-24 grid-item p-0">
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
    <div class = "h-fit  w-full flex flex-col justify-center mb-4">
        <div class = "h-10 w-full flex mb-2">
            <div class = "flex ml-2 w-[90px] bg-slate-600 rounded-t-lg justify-center">
                <input type="text" class = "rounded-lg w-full h-[42px]" bind:value={draftTriFilter} on:input={filterDrafts}>
            </div>
            <div class = "flex ml-2 w-[350px] rounded-t-lg justify-center h-10"> 
                <input type="text" class = "rounded-lg w-full h-[42px]" bind:value={draftNameFilter} on:input={filterDrafts}>
            </div>
        </div>
        <div class = "flex w-fit h-8 font-semibold">
            <div class = "flex ml-2 w-[90px] bg-slate-600 rounded-t-lg justify-center">
                <div>Opponent</div>
            </div>
            <div class = "flex ml-2 w-[350px] bg-slate-600 rounded-t-lg justify-center"> 
                <div >Name</div>
            </div>
            <div class = "flex ml-2 space-x-1">
                <div class = "bg-slate-600 px-2 rounded-tl-lg w-[50px] justify-center flex">BB 1</div>
                <div class = "bg-slate-600 px-2 w-[50px] justify-center flex" >RB 1</div>
                <div class = "bg-slate-600 px-2 w-[50px] justify-center flex">BB 2</div>
                <div class = "bg-slate-600 px-2 w-[50px] justify-center flex">RB 2</div>
                <div class = "bg-slate-600 px-2 w-[50px] justify-center flex">BB 3</div>
                <div class = "bg-slate-600 px-2 rounded-tr-lg w-[50px] justify-center flex">RB 3</div>
            </div>
            <div class = "flex ml-2 space-x-1">
                <div class = "bg-slate-600 px-2 rounded-tl-lg w-[50px] justify-center flex">BP 1</div>
                <div class = "bg-slate-600 px-2 w-[88px] justify-center flex">RP 1-2</div>
                <div class = "bg-slate-600 px-2 w-[88px] justify-center flex">BP 2-3</div>
                <div class = "bg-slate-600 px-2 rounded-tr-lg w-[50px] justify-center flex">RP 3</div>
            </div>
            <div class = "flex ml-2 space-x-1">
                <div class = "bg-slate-600 px-2 rounded-tl-lg w-[50px] justify-center flex">BB 4</div>
                <div class = "bg-slate-600 px-2 w-[50px] justify-center flex">RB 4</div>
                <div class = "bg-slate-600 px-2 w-[50px] justify-center flex">BB 5</div>
                <div class = "bg-slate-600 px-2 rounded-tr-lg w-[50px] justify-center flex">RB 5</div>
            </div>
            <div class = "flex ml-2 space-x-1">
                <div class = "bg-slate-600 px-2 rounded-tl-lg w-[50px] justify-center flex">RP 4</div>
                <div class = "bg-slate-600 px-2 w-[88px] justify-center flex">BP 4-5</div>
                <div class = "bg-slate-600 px-2 rounded-tr-lg w-[50px] justify-center flex">RP 5</div>
            </div>
        </div>
        <div class = "flex flex-col w-fit h-fit mt-1 font-semibold">
            {#if filteredDrafts.length != 0}
                {#each filteredDrafts as Draft}
                    <div class = "flex w-fit h-10 mt-2">
                        <div class = "flex ml-2 w-[90px] bg-slate-600 justify-center">
                            <div class = "self-center text-2xl font-bold">{Draft.opponent.code}</div>
                        </div>
                        <div class = "flex ml-2 w-[350px] bg-slate-600 justify-start"> 
                            <div class = "ml-2 self-center">{Draft.name}</div>
                        </div>
                        <div class = "flex ml-2 space-x-1">
                            <div class = "bg-blue-700 px-2 w-[50px] flex justify-center"> 
                                <div class = "h-[34px] self-center bg-slate-700 w-[34px]">
                                    <img class = "grayscale " src="./champIcons/{Draft.bb1}.webp" alt="" in:fly>
                                </div>
                            </div>
                            <div class = "bg-red-700 px-2 w-[50px] flex justify-center ">
                                <div class = "h-[34px] self-center bg-slate-700 w-[34px]">
                                    <img class = "grayscale " src="./champIcons/{Draft.rb2}.webp" alt="" in:fly>
                                </div>
                            </div>
                            <div class = "bg-blue-700 px-2 w-[50px] flex justify-center ">
                                <div class = "h-[34px] self-center bg-slate-700 w-[34px]">
                                    <img class = "grayscale " src="./champIcons/{Draft.bb2}.webp" alt="" in:fly>
                                </div>
                            </div>
                            <div class = "bg-red-700 px-2 w-[50px] flex justify-center ">
                                <div class = "h-[34px] self-center bg-slate-700 w-[34px]">
                                    <img class = "grayscale " src="./champIcons/{Draft.rb2}.webp" alt="" in:fly>
                                </div>
                            </div>
                            <div class = "bg-blue-700 px-2 w-[50px] flex justify-center">
                                <div class = "h-[34px] self-center bg-slate-700 w-[34px]">
                                    <img class = "grayscale " src="./champIcons/{Draft.bb3}.webp" alt="" in:fly>
                                </div>
                            </div>
                            <div class = "bg-red-700 px-2 w-[50px] flex justify-center ">
                                <div class = "h-[34px] self-center bg-slate-700 w-[34px]">
                                    <img class = "grayscale " src="./champIcons/{Draft.rb3}.webp" alt="" in:fly>
                                </div>
                            </div>
                        </div>
                        <div class = "flex ml-2 space-x-1">
                            <div class = "bg-blue-700 px-2 w-[50px] flex justify-center ">
                                <div class = "h-[34px] self-center bg-slate-700 w-[34px]">
                                    <img  src="./champIcons/{Draft.bp1}.webp" alt="" in:fly>
                                </div>
                            </div>
                            <div class = "bg-red-700 px-2 w-[88px] flex justify-center ">
                                <div class = "h-[34px] self-center mr-1 bg-slate-700 w-[34px]">
                                    <img  src="./champIcons/{Draft.rp1}.webp" alt="" in:fly>
                                </div>
                                <div class = "h-[34px] self-center bg-slate-700 w-[34px]">
                                    <img  src="./champIcons/{Draft.rp2}.webp" alt="" in:fly>
                                </div>
                            </div>
                            <div class = "bg-blue-700 px-2 w-[88px] flex justify-center ">
                                <div class = "h-[34px] self-center mr-1 bg-slate-700 w-[34px]">
                                    <img  src="./champIcons/{Draft.bp2}.webp" alt="" in:fly>
                                </div>
                                <div class = "h-[34px] self-center bg-slate-700 w-[34px]">
                                    <img  src="./champIcons/{Draft.bp3}.webp" alt="" in:fly>
                                </div>
                            </div>
                            <div class = "bg-red-700 px-2 w-[50px] flex justify-center ">
                                <div class = "h-[34px] self-center bg-slate-700 w-[34px]" >
                                    <img  src="./champIcons/{Draft.rp3}.webp" alt="" in:fly>
                                </div>
                            </div>
                        </div>
                        <div class = "flex ml-2 space-x-1">
                            <div class = "bg-blue-700 px-2 w-[50px] flex justify-center ">
                                <div class = "h-[34px] self-center bg-slate-700 w-[34px]">
                                    <img class = "grayscale " src="./champIcons/{Draft.bb4}.webp" alt="" in:fly>
                                </div>
                            </div>
                            <div class = "bg-red-700 px-2 w-[50px] flex justify-center ">
                                <div class = "h-[34px] self-center bg-slate-700 w-[34px]">
                                    <img class = "grayscale " src="./champIcons/{Draft.rb4}.webp" alt="" in:fly>
                                </div>
                            </div>
                            <div class = "bg-blue-700 px-2 w-[50px] flex justify-center ">
                                <div class = "h-[34px] self-center bg-slate-700 w-[34px]">
                                    <img class = "grayscale" src="./champIcons/{Draft.bb5}.webp" alt="" in:fly>
                                </div>
                            </div>
                            <div class = "bg-red-700 px-2 w-[50px] flex justify-center ">
                                <div class = "h-[34px] self-center bg-slate-700 w-[34px]">
                                    <img class = "grayscale " src="./champIcons/{Draft.rb5}.webp" alt="" in:fly>
                                </div>
                            </div>
                        </div>
                        <div class = "flex ml-2 space-x-1">
                            <div class = "bg-red-700 px-2 w-[50px] flex justify-center content-center">
                                <div class = "h-[34px] self-center bg-slate-700 w-[34px]">
                                    <img src="./champIcons/{Draft.rp4}.webp" alt="" in:fly>
                                </div>
                            </div>
                            <div class = "bg-blue-700 px-2 w-[88px] flex justify-center content-center">
                                <div class = "h-[34px] self-center mr-1 bg-slate-700 w-[34px]">
                                    <img src="./champIcons/{Draft.bp4}.webp" alt="" in:fly>
                                </div>
                                <div class = "h-[34px] self-center bg-slate-700 w-[34px]">
                                    <img src="./champIcons/{Draft.bp5}.webp" alt="" in:fly>
                                </div>
                            </div>
                            <div class = "bg-red-700 px-2 w-[50px] flex justify-center content-center">
                                <div class = "h-[34px] self-center bg-slate-700 w-[34px]">
                                    <img src="./champIcons/{Draft.rp5}.webp" alt="" in:fly>
                                </div>
                            </div>
                        </div>
                        <button class = "bg-slate-600 h-10 w-10 ml-2 rounded-lg hover:bg-slate-400" id = {Draft.draftid} on:click={loadDraft}>
                            <div class = "flex justify-center content-center">
                                <CircleArrowDownSolid />
                            </div>
                        </button>
                    </div>
                {/each}
            {/if}
        </div>
    </div>
    
</main>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

<style>

    li {
        cursor: pointer;
        display: inline-block;
    }
</style>

