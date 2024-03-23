const gen1Info = [{
    name: "bulbasaur",
    gen: 1,
    info: {
        natDexNum: 1,
        HA: {
            hasHA: true,
            name: {reg: "Chlorophyll"}
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Amnesia', 'Charm', 'Curse', 'Endure', 'Giga Drain', 'Grass Whistle', 'Grassy Terrain', 'Ingrain', 'Leaf Storm', 'Magical Leaf', 'Nature Power', 'Petal Dance', 'Power Whip', 'Skull Bash', 'Sludge']},
            balls: {
                apriball: {isLegal: false, haIsLegal: false},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Amnesia', 'Charm', 'Curse', 'Endure', 'Giga Drain', 'Grass Whistle', 'Grassy Terrain', 'Ingrain', 'Leaf Storm', 'Magical Leaf', 'Nature Power', 'Petal Dance', 'Power Whip', 'Skull Bash', 'Sludge']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Skull Bash', 'Petal Dance', 'Curse', 'Ingrain', 'Nature Power'], bdspOnly: ['Amnesia', 'Toxic', 'Charm', 'Magical Leaf', 'Leaf Storm', 'Power Whip', 'Sludge', 'Grassy Terrain']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            eggmoves: {moves: ['Petal Dance', 'Toxic', 'Curse', 'Ingrain']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "charmander",
    gen: 1,
    info: {
        natDexNum: 4,
        HA: {
            hasHA: true,
            name: {reg: "Solar Power"}
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Air Cutter', 'Ancient Power', 'Beat Up' , 'Belly Drum', 'Bite', 'Counter', 'Crunch' ,'Dragon Dance', 'Dragon Pulse', 'Dragon Rush', 'Flare Blitz', 'Focus Punch', 'Metal Claw', 'Outrage']},
            balls: {
                apriball: {isLegal: false, haIsLegal: false},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Air Cutter', 'Ancient Power', 'Beat Up' , 'Belly Drum', 'Bite', 'Counter', 'Crunch' ,'Dragon Dance', 'Dragon Pulse', 'Dragon Rush', 'Flare Blitz', 'Focus Punch', 'Metal Claw', 'Outrage']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Belly Drum', 'Ancient Power', 'Bite', 'Dragon Rush', 'Metal Claw', 'Counter', 'Wing Attack', 'Dragon Tail'], bdspOnly: ['Outrage', 'Beat Up', 'Dragon Dance', 'Crunch', 'Flare Blitz', 'Air Cutter']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            eggmoves: {moves: ['Bite', 'Counter', 'Belly Drum', 'Iron Tail', 'Metal Claw', 'Ancient Power', 'Dragon Rush', 'Dragon Tail']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "squirtle",
    gen: 1,
    info: {
        natDexNum: 7,
        HA: {
            hasHA: true,
            name: {reg: "Rain Dish"}
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Aqua Jet', 'Aqua Ring', 'Aura Sphere', 'Brine', 'Dragon Pulse', 'Fake Out', 'Flail', 'Foresight', 'Haze', 'Mirror Coat', 'Mist', 'Mud Sport', 'Muddy Water', 'Refresh', 'Water Spout', 'Yawn']},
            balls: {
                apriball: {isLegal: false, haIsLegal: false},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Aqua Jet', 'Aqua Ring', 'Aura Sphere', 'Brine', 'Dragon Pulse', 'Fake Out', 'Flail', 'Foresight', 'Haze', 'Mirror Coat', 'Mist', 'Mud Sport', 'Muddy Water', 'Refresh', 'Water Spout', 'Yawn']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Mirror Coat', 'Haze', 'Mist', 'Flail', 'Yawn', 'Fake Out', 'Aqua Ring', 'Aqua Jet', 'Water Spout', 'Life Dew'], bdspOnly: ['Muddy Water', 'Aura Sphere']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        }, 
        gen9: {
            eggmoves: {moves: ['Mist', 'Flail', 'Mirror Coat', 'Fake Out', 'Yawn', 'Water Spout', 'Aqua Ring', 'Aqua Jet', 'Life Dew']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "caterpie",
    gen: 1,
    info: {
        natDexNum: 10,
        HA: {
            hasHA: true,
            name: {reg: "Run Away"}
        }
    },
    specificGenInfo: {
        gen6: {
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: true, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        }
    }
}, {
    name: "weedle",
    gen: 1,
    info: {
        natDexNum: 13,
        HA: {
            hasHA: true,
            name: {reg: "Run Away"}
        }
    },
    specificGenInfo: {
        gen6: {
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: true, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            balls: {
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: false, haIsLegal: false},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        }
    }
}, {
    name: "pidgey",
    gen: 1,
    info: {
        natDexNum: 16,
        HA: {
            hasHA: true,
            name: {reg: "Big Pecks"}
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Air Cutter', 'Air Slash', 'Brave Bird', 'Defog', 'Feint Attack', 'Foresight', 'Pursuit', 'Steel Wing', 'Uproar']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Air Cutter', 'Air Slash', 'Brave Bird', 'Defog', 'Feint Attack', 'Foresight', 'Pursuit', 'Steel Wing', 'Uproar']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Air Cutter', 'Air Slash', 'Brave Bird', 'Uproar']},
            balls: {
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: false, haIsLegal: false},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        }
    }
}, {
    name: "rattata",
    gen: 1,
    info: {
        natDexNum: 19,
        HA: {
            hasHA: true,
            name: {reg: "Hustle", alt1: "Thick Fat"}
        },
        regionalForm: {
            forms: [{name: "Alolan", gen: 7}]
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Bite', 'Counter', 'Final Gambit', 'Flame Wheel', 'Fury Swipes', 'Last Resort', 'Me First', 'Revenge', 'Reversal', 'Screech', 'Uproar']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Fury Swipes', 'Counter', 'Reversal', 'Uproar','Me First', 'Revenge', 'Final Gambit'], regFormOnly: ['Screech', 'Flame Wheel', 'Last Resort', 'Bite'], regionalFormOnly: ['Snatch', 'Stockpile','Switcheroo', 'Swallow']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Screech', 'Flame Wheel', 'Fury Swipes', 'Bite', 'Counter', 'Reversal', 'Uproar', 'Last Resort', 'Revenge', 'Final Gambit']},
            balls: {
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: false, haIsLegal: false},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        }
    }
}, {
    name: "spearow",
    gen: 1,
    info: {
        natDexNum: 21,
        HA: {
            hasHA: true,
            name: {reg: "Sniper"}
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Astonish', 'Feather Dance', 'Feint Attack', 'Quick Attack', 'Razor Wind','Scary Face', 'Sky Attack', 'Steel Wing', 'Tri Attack' ,'Uproar', 'Whirlwind']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Astonish', 'Feather Dance', 'Feint Attack', 'Quick Attack', 'Razor Wind','Scary Face', 'Sky Attack', 'Steel Wing', 'Tri Attack' ,'Uproar', 'Whirlwind']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Scary Face', 'Quick Attack', 'Tri Attack', 'Astonish', 'Sky Attack', 'Whirlwind', 'Uproar', 'Feather Dance']},
            balls: {
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: false, haIsLegal: false},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        }
    }
}, {
    name: "ekans",
    gen: 1,
    info: {
        natDexNum: 23, 
        HA: {
            hasHA: true,
            name: {reg: "Unnerve"}
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Pursuit', 'Slam', 'Spite', 'Beat Up', 'Poison Fang', 'Scary Face', 'Poison Tail', 'Disable', 'Switcheroo', 'Iron Tail', 'Sucker Punch', 'Snatch']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Pursuit', 'Slam', 'Spite', 'Beat Up', 'Poison Fang', 'Scary Face', 'Poison Tail', 'Disable', 'Switcheroo', 'Iron Tail', 'Sucker Punch', 'Snatch']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Slam', 'Spite', 'Beat Up', 'Poison Fang', 'Scary Face', 'Poison Tail', 'Disable', 'Switcheroo', 'Sucker Punch']},
            balls: {
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: false, haIsLegal: false},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        }, 
        gen9: {
            eggmoves: {moves: ['Spite', 'Scary Face', 'Poison Fang', 'Poison Tail', 'Sucker Punch', 'Switcheroo']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "pikachu",
    gen: 1,
    info: {
        natDexNum: 25,
        HA: {
            hasHA: true,
            name: {reg: "Lightningrod"}
        },
        special: {
            hasBabyMon: true,
            child: {
                name: "pichu",
                gen: 2,
                natDexNum: 172
            }
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Bestow', 'Bide', 'Charge', 'Disarming Voice', 'Double Slap', 'Encore', 'Endure', 'Fake Out', 'Flail', 'Lucky Chant', 'Present', 'Reversal', 'Thunder Punch', 'Tickle', 'Wish', 'Volt Tackle']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Bestow', 'Bide', 'Charge', 'Disarming Voice', 'Double Slap', 'Encore', 'Endure', 'Fake Out', 'Flail', 'Lucky Chant', 'Present', 'Reversal', 'Thunder Punch', 'Tickle', 'Wish', 'Volt Tackle', 'Electric Terrain']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Present', 'Wish', 'Charge', 'Fake Out', 'Tickle', 'Flail', 'Disarming Voice'], bdspOnly: ['Reversal', 'Encore', 'Thunder Punch', 'Electric Terrain', 'Volt Tackle']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            eggmoves: {moves: ['Flail', 'Present', 'Fake Out', 'Charge', 'Wish', 'Tickle', 'Disarming Voice', 'Volt Tackle']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "alolan Raichu",
    gen: 7,
    info: {
        natDexNum: 26,
        HA: {
            hasHA: false
        },
        evolvedRegionalForm: true,
        species: 'Raichu'
    },
    specificGenInfo: {
        gen7: {
            eggmoves: {moves: ['Bestow', 'Bide', 'Charge', 'Disarming Voice', 'Double Slap', 'Encore', 'Endure', 'Fake Out', 'Flail', 'Lucky Chant', 'Present', 'Reversal', 'Thunder Punch', 'Tickle', 'Wish', 'Volt Tackle', 'Electric Terrain']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Present', 'Wish', 'Charge', 'Fake Out', 'Tickle', 'Flail', 'Disarming Voice']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            eggmoves: {moves: ['Flail', 'Present', 'Fake Out', 'Charge', 'Wish', 'Tickle', 'Disarming Voice', 'Volt Tackle']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "sandshrew",
    gen: 1,
    info: {
        natDexNum: 27,
        HA: {
            hasHA: true,
            name: {reg: "Sand Rush", alt1: "Slush Rush"}
        },
        regionalForm: {
            forms: [{name: "Alolan", gen: 7}]
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Chip Away', 'Counter', 'Crush Claw', 'Endure', 'Flail', 'Metal Claw', 'Mud Shot', 'Night Slash', 'Rapid Spin', 'Rock Climb', 'Rototiller']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Flail', 'Counter', 'Metal Claw', 'Crush Claw', 'Night Slash', 'Endure', 'Chip Away'], regFormOnly: ['Rapid Spin', 'Mud Shot', 'Rock Climb', 'Rototiller'], regionalFormOnly: ['Icicle Spear', 'Icicle Crash', 'Curse', 'Amnesia'], usumOnly: ['Hone Claws']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Counter', 'Flail', 'Night Slash', 'Hone Claws'], regFormOnly: ['Mud-Slap', 'Metal Claw'], regionalFormOnly: ['Crush Claw', 'Curse'], bdspOnly: ['Rapid Spin', 'Crush Claw', 'Mud Shot']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            eggmoves: {moves: ['Counter', 'Flail', 'Night Slash', 'Hone Claws'], regFormOnly: ['Mud-Slap', 'Metal Claw'], regionalFormOnly: ['Curse', 'Mirror Coat', 'Crush Claw', 'Ice Shard']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "nidoran♀",
    gen: 1,
    info: {
        natDexNum: 29,
        HA: {
            hasHA: true,
            name: {reg: "Hustle"}
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Beat Up', 'Charm', 'Chip Away', 'Counter', 'Disable', 'Endure', 'Focus Energy', 'Iron Tail', 'Poison Tail', 'Pursuit', 'Skull Bash', 'Supersonic', 'Take Down', 'Venom Drench']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Beat Up', 'Charm', 'Chip Away', 'Counter', 'Disable', 'Endure', 'Focus Energy', 'Iron Tail', 'Poison Tail', 'Pursuit', 'Skull Bash', 'Supersonic', 'Take Down', 'Venom Drench']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Counter', 'Disable', 'Poison Tail', 'Skull Bash', 'Supersonic', 'Take Down', 'Poison Fang'], bdspOnly: ['Focus Energy', 'Charm', 'Beat Up', 'Venom Drench']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        }
    }
}, {
    name: "nidoran♂",
    gen: 1,
    info: {
        natDexNum: 32,
        HA: {
            hasHA: true,
            name: {reg: "Hustle"}
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Counter', 'Disable', 'Supersonic', 'Take Down' ,'Amnesia', 'Confusion', 'Beat Up', 'Sucker Punch', 'Head Smash', 'Iron Tail', 'Poison Tail', 'Endure', 'Chip Away', 'Venom Drench']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Counter', 'Disable', 'Supersonic', 'Take Down' ,'Amnesia', 'Confusion', 'Beat Up', 'Sucker Punch', 'Head Smash', 'Iron Tail', 'Poison Tail', 'Endure', 'Chip Away', 'Venom Drench']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Confusion', 'Counter', 'Disable', 'Head Smash', 'Poison Tail', 'Sucker Punch', 'Supersonic', 'Take Down', 'Horn Drill', 'Thrash'], bdspOnly: ['Amnesia', 'Beat Up', 'Venom Drench']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        }
    }
}, {
    name: "clefairy",
    gen: 1,
    info: {
        natDexNum: 35,
        HA: {
            hasHA: true,
            name: {reg: "Friend Guard"}
        },
        special: {
            hasBabyMon: true,
            child: {
                name: "cleffa",
                gen: 2,
                natDexNum: 173
            }
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Amnesia', 'Aromatherapy', 'Belly Drum', 'Covet', 'Fake Tears', 'Heal Pulse', 'Metronome', 'Mimic', 'Misty Terrain', 'Present', 'Splash', 'Stored Power', 'Tickle', 'Wish']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Amnesia', 'Aromatherapy', 'Belly Drum', 'Covet', 'Fake Tears', 'Heal Pulse', 'Metronome', 'Mimic', 'Misty Terrain', 'Present', 'Splash', 'Stored Power', 'Tickle', 'Wish']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Present', 'Wish', 'Aromatherapy', 'Tickle', 'Heal Pulse'], bdspOnly: ['Metronome', 'Belly Drum', 'Splash', 'Mimic', 'Fake Tears', 'Covet', 'Stored Power', 'Misty Terrain']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        }, 
        gen9: {
            eggmoves: {moves: ['Present', 'Wish', 'Tickle', 'Heal Pulse']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "vulpix",
    gen: 1,
    info: {
        natDexNum: 37,
        HA: {
            hasHA: true,
            name: {reg: "Drought", alt1: "Snow Warning"}
        },
        regionalForm: {
            forms: [{name: "Alolan", gen: 7}]
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Captivate', 'Disable', 'Extrasensory', 'Feint Attack', 'Flail', 'Flare Blitz', 'Heat Wave', 'Hex', 'Howl', 'Hypnosis', 'Power Swap', 'Secret Power', 'Spite', 'Tail Slap']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Hypnosis', 'Flail', 'Spite', 'Disable', 'Howl', 'Extrasensory', 'Power Swap', 'Secret Power', 'Tail Slap'], regFormOnly: ['Feint Attack', 'Heat Wave', 'Flare Blitz', 'Hex', 'Captivate'], regionalFormOnly: ['Freeze-Dry', 'Agility', 'Encore', 'Moonblast', 'Charm']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Hypnosis', 'Flail', 'Howl', 'Baby-Doll Eyes'], regFormOnly: ['Flame Charge', 'Memento', ''], regionalFormOnly: ['Freeze-Dry', 'Moonblast'], swshOnly: ['Roar'], bdspOnly: ['Spite', 'Disable', 'Heat Wave', 'Flare Blitz', 'Extrasensory', 'Power Swap', 'Hex']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        }, 
        gen9: {
            eggmoves: {moves: ['Roar', 'Hypnosis', 'Flail', 'Howl', 'Baby-Doll Eyes'], regFormOnly: ['Memento', 'Healing Wish', 'Flame Charge'], regionalFormOnly: ['Moonblast']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "jigglypuff",
    gen: 1,
    info: {
        natDexNum: 39,
        HA: {
            hasHA: true,
            name: {reg: "Friend Guard"}
        },
        special: {
            hasBabyMon: true,
            child: {
                name: "igglybuff",
                gen: 2,
                natDexNum: 174
            }
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Captivate', 'Covet', 'Fake Tears', 'Feint Attack', 'Gravity', 'Heal Pulse', 'Last Resort', 'Misty Terrain', 'Perish Song', 'Present', 'Punishment', 'Sleep Talk', 'Wish']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Captivate', 'Covet', 'Fake Tears', 'Feint Attack', 'Gravity', 'Heal Pulse', 'Last Resort', 'Misty Terrain', 'Perish Song', 'Present', 'Punishment', 'Sleep Talk', 'Wish']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Covet', 'Gravity', 'Heal Pulse', 'Last Resort', 'Persih Song', 'Present', 'Wish', 'Rollout'], bdspOnly: ['Fake Tears', 'Misty Terrain']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            eggmoves: {moves: ['Perish Song', 'Rollout', 'Present', 'Wish', 'Covet', 'Gravity', 'Last Resort', 'Heal Pulse']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }    
    }
}, {
    name: "zubat",
    gen: 1,
    info: {
        natDexNum: 41,
        HA: {
            hasHA: true,
            name: {reg: "Infiltrator"}
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Quick Attack', 'Pursuit', 'Feint Attack', 'Gust', 'Whirlwind', 'Curse', 'Nasty Plot', 'Hypnosis', 'Zen Headbutt', 'Brave Bird', 'Giga Drain', 'Steel Wing', 'Defog', 'Venom Drench']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Quick Attack', 'Pursuit', 'Feint Attack', 'Gust', 'Whirlwind', 'Curse', 'Nasty Plot', 'Hypnosis', 'Zen Headbutt', 'Brave Bird', 'Giga Drain', 'Steel Wing', 'Defog', 'Venom Drench']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Curse', 'Gust', 'Hypnosis', 'Quick Attack', 'Whirlwind', 'Wing Attack'], swshOnly: ['Defog'], bdspOnly: ['Zen Headbutt', 'Brave Bird', 'Venom Drench']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        }
    }
}, {
    name: "oddish",
    gen: 1,
    info: {
        natDexNum: 43,
        HA: {
            hasHA: true,
            name: {reg: "Run Away"}
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['After You', 'Charm', 'Flail', 'Ingrain', 'Nature Power', 'Razor Leaf', 'Secret Power', 'Synthesis', 'Teeter Dance', 'Tickle']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Razor Leaf', 'Flail', 'Synthesis', 'Charm', 'Ingrain', 'Tickle', 'Teeter Dance', 'Secret Power', 'Nature Power', 'After You'], usumOnly: ['Strength Sap']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Razor Leaf', 'Flail', 'Synthesis', 'Ingrain', 'Tickle', 'Teeter Dance', 'Nature Power', 'After You', 'Strength Sap', 'Leech Seed'], bdspOnly: ['Charm']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            eggmoves: {moves: ['Leech Seed', 'Razor Leaf', 'Flail', 'Synthesis', 'Ingrain', 'Teeter Dance', 'Tickle', 'After You', 'Strength Sap']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "paras",
    gen: 1,
    info: {
        natDexNum: 46,
        HA: {
            hasHA: true,
            name: {reg: "Damp"}
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Pursuit', 'Endure', 'Natural Gift', 'Rototiller', 'Screech', 'Counter',' Psybeam', 'Flail', 'Sweet Scent', 'Metal Claw', 'Bug Bite', 'Cross Poison', 'Agility', 'Leech Seed', 'Wide Guard', 'Fell Stinger']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: true, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Pursuit', 'Endure', 'Natural Gift', 'Rototiller', 'Screech', 'Counter',' Psybeam', 'Flail', 'Sweet Scent', 'Metal Claw', 'Bug Bite', 'Cross Poison', 'Agility', 'Leech Seed', 'Wide Guard', 'Fell Stinger'], usumOnly: ['Grassy Terrain']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Screech', 'Counter',' Psybeam', 'Flail', 'Sweet Scent', 'Metal Claw', 'Bug Bite', 'Cross Poison', 'Agility', 'Leech Seed', 'Wide Guard', 'Fell Stinger', 'Grassy Terrain']},
            balls: {
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        }
    }
}, {
    name: "venonat",
    gen: 1,
    info: {
        natDexNum: 48,
        HA: {
            hasHA: true,
            name: {reg: "Run Away"}
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Agility', 'Baton Pass', 'Bug Bite', 'Giga Drain', 'Morning Sun', 'Rage Powder', 'Screech', 'Secret Power', 'Signal Beam', 'Skill Swap', 'Toxic Spikes']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: true, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Agility', 'Baton Pass', 'Bug Bite', 'Giga Drain', 'Morning Sun', 'Rage Powder', 'Screech', 'Secret Power', 'Signal Beam', 'Skill Swap', 'Toxic Spikes']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Baton Pass', 'Screech', 'Agility', 'Morning Sun', 'Toxic Spikes', 'Bug Bite', 'Rage Powder']},
            balls: {
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: false, haIsLegal: false},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            eggmoves: {moves: ['Agility', 'Screech', 'Baton Pass', 'Morning Sun', 'Toxic Spikes', 'Bug Bite', 'Venoshock', 'Rage Powder']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "diglett",
    gen: 1,
    info: {
        natDexNum: 50,
        HA: {
            hasHA: true,
            name: {reg: "Sand Force", alt1: "Sand Force"}
        },
        regionalForm: {
            forms: [{name: "Alolan", gen: 7}]
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Feint Attack', 'Ancient Power', 'Pursuit', 'Headbutt', 'Final Gambit', 'Memento', 'Beat Up', 'Reversal', 'Endure', 'Screech', 'Uproar', 'Mud Bomb', 'Astonish']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Feint Attack', 'Ancient Power', 'Pursuit', 'Headbutt', 'Final Gambit', 'Memento', 'Beat Up', 'Reversal', 'Endure'], regFormOnly: ['Screech', 'Uproar', 'Mud Bomb', 'Astonish'], regionalFormOnly: ['Metal Sound', 'Thrash']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Ancient Power', 'Headbutt', 'Final Gambit', 'Memento', 'Hone Claws'], regionalFormOnly: ['Metal Sound', 'Thrash'], bdspOnly: ['Screech', 'Beat Up', 'Uproar', 'Astonish', 'Reversal']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            eggmoves: {moves: ['Headbutt', 'Ancient Power', 'Memento', 'Hone Claws', 'Final Gambit'], regionalFormOnly: ['Thrash', 'Metal Sound']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "meowth",
    gen: 1,
    info: {
        natDexNum: 52,
        HA: {
            hasHA: true,
            name: {reg: "Unnerve", alt1: "Rattled", alt2: "Unnerve"}
        },
        regionalForm: {
            forms: [{name: "Alolan", gen: 7}, {name: "Galarian", gen: 8}]
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Amnesia', 'Assist', 'Charm', 'Flail', 'Foul Play', 'Hypnosis', 'Iron Tail', 'Last Resort', 'Odor Sleuth', 'Punishment', 'Snatch', 'Spite', 'Tail Whip']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Spite', 'Charm', 'Hypnosis', 'Amnesia', 'Assist', 'Flail', 'Punishment', 'Snatch', 'Foul Play'], regFormOnly: ['Odor Sleuth', 'Last Resort', 'Tail Whip', 'Iron Tail'], regionalFormOnly: ['Parting Shot', 'Flatter', 'Covet']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Spite', 'Flail', 'Covet'], regFormOnly: ['Last Resort', 'Tail Whip'], regionalForm1Only: ['Parting Shot', 'Flatter'], regionalForm2Only: ['Double-Edge', 'Curse', 'Night Slash'], regAndRegionalForm1Only: ['Hypnosis'], bdspOnly: ['Charm', 'Amnesia', 'Foul Play']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            eggmoves: {moves: ['Spite', 'Flail', 'Covet'], regFormOnly: ['Last Resort', 'Tail Whip'], regionalForm1Only: ['Parting Shot', 'Flatter'], regionalForm2Only: ['Double-Edge', 'Curse', 'Night Slash'], regAndRegionalForm1Only: ['Hypnosis']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "psyduck",
    gen: 1,
    info: {
        natDexNum: 54,
        HA: {
            hasHA: true,
            name: {reg: "Swift Swim"}
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Hypnosis', 'Psybeam', 'Foresight', 'Future Sight', 'Cross Chop', 'Refresh', 'Confuse Ray', 'Yawn', 'Mud Bomb', 'Encore', 'Secret Power', 'Sleep Talk', 'Synchronoise', 'Simple Beam', 'Clear Smog']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Hypnosis', 'Psybeam', 'Foresight', 'Future Sight', 'Cross Chop', 'Refresh', 'Confuse Ray', 'Yawn', 'Mud Bomb', 'Encore', 'Secret Power', 'Sleep Talk', 'Synchronoise', 'Simple Beam', 'Clear Smog']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Clear Smog', 'Confuse Ray', 'Cross Chop', 'Hypnosis', 'Psybeam', 'Simple Beam', 'Yawn'], bdspOnly: ['Future Sight', 'Encore']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            eggmoves: {moves: ['Psybeam', 'Hypnosis', 'Confuse Ray', 'Cross Chop', 'Yawn', 'Simple Beam', 'Clear Smog']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "mankey",
    gen: 1,
    info: {
        natDexNum: 56,
        HA: {
            hasHA: true,
            name: {reg: "Defiant"}
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Beat Up', 'Close Combat', 'Counter', 'Encore', 'Focus Punch', 'Foresight', 'Meditate', 'Night Slash', 'Revenge', 'Reversal', 'Sleep Talk', 'Smelling Salts']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Beat Up', 'Close Combat', 'Counter', 'Encore', 'Focus Punch', 'Foresight', 'Meditate', 'Night Slash', 'Revenge', 'Reversal', 'Sleep Talk', 'Smelling Salts', 'Power Trip']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Counter', 'Reversal', 'Beat Up', 'Revenge', 'Close Combat', 'Encore', 'Night Slash']},
            balls: {
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: false, haIsLegal: false},
                    sport: {isLegal: false, haIsLegal: false},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            eggmoves: {moves: ['Counter', 'Curse', 'Spite', 'Encore', 'Beat Up', 'Night Slash']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "growlithe",
    gen: 1,
    info: {
        natDexNum: 58,
        HA: {
            hasHA: true,
            name: {reg: "Justified", alt1: "Justified"}
        },
        regionalForm: {
            forms: [{name: "Hisuian", gen: 9}]
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Body Slam', 'Crunch', 'Fire Spin', 'Howl', 'Heat Wave', 'Flare Blitz', 'Close Combat', 'Burn Up', 'Thrash', 'Double-Edge', 'Morning Sun', 'Covet', 'Double Kick', 'Iron Tail']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Body Slam', 'Crunch', 'Fire Spin', 'Howl', 'Heat Wave', 'Flare Blitz', 'Close Combat', 'Burn Up', 'Thrash', 'Double-Edge', 'Morning Sun', 'Covet', 'Double Kick', 'Iron Tail']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Thrash', 'Double-Edge', 'Morning Sun', 'Covet', 'Double Kick'], bdspOnly: ['Body Slam', 'Crunch', 'Fire Spin', 'Howl', 'Heat Wave', 'Flare Blitz', 'Close Combat', 'Burn Up']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            eggmoves: {moves: ['Double Kick', 'Thrash', 'Double-Edge', 'Morning Sun', 'Covet'], regFormOnly: ['Raging Fury'], regionalFormOnly: ['Head Smash']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "poliwag",
    gen: 1,
    info: {
        natDexNum: 60,
        HA: {
            hasHA: true,
            name: {reg: "Swift Swim"}
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Bubble Beam', 'Encore', 'Endeavor', 'Endure', 'Haze', 'Ice Ball', 'Mind Reader', 'Mist', 'Mud Shot', 'Refresh', 'Splash', 'Water Pulse', 'Water Sport']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Bubble Beam', 'Encore', 'Endeavor', 'Endure', 'Haze', 'Ice Ball', 'Mind Reader', 'Mist', 'Mud Shot', 'Refresh', 'Splash', 'Water Pulse', 'Water Sport']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Endeavor', 'Haze', 'Mist', 'Mind Reader', 'Splash'], swshOnly: ['Water Pulse'], bdspOnly: ['Bubble Beam', 'Mud Shot', 'Encore']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        }, 
        gen9: {
            eggmoves: {moves: ['Mist', 'Splash', 'Endeavour', 'Muddy Water', 'Water Pulse']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "abra",
    gen: 1,
    info: {
        natDexNum: 63,
        HA: {
            hasHA: true,
            name: {reg: "Magic Guard"}
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Encore', 'Barrier', 'Knock Off', 'Fire Punch', 'Thunder Punch', 'Ice Punch', 'Power Trick', 'Guard Swap', 'Skill Swap', 'Guard Split', 'Psycho Shift', 'Ally Switch']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Encore', 'Barrier', 'Knock Off', 'Fire Punch', 'Thunder Punch', 'Ice Punch', 'Power Trick', 'Guard Swap', 'Skill Swap', 'Guard Split', 'Psycho Shift', 'Ally Switch'], usumOnly: ['Psychic Terrain']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Confusion', 'Guard Split', 'Magic Coat'], bdspOnly: ['Encore', 'Knock Off', 'Fire Punch', 'Thunder Punch', 'Ice Punch', 'Power Trick', 'Guard Swap', 'Psycho Shift', 'Ally Switch']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        }
    }
}, {
    name: "machop",
    gen: 1,
    info: {
        natDexNum: 66,
        HA: {
            hasHA: true,
            name: {reg: "Steadfast"}
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Bullet Punch', 'Close Combat', 'Counter', 'Encore', 'Fire Punch', 'Heavy Slam', 'Ice Punch', 'Knock Off', 'Meditate', 'Power Trick', 'Quick Guard', 'Rolling Kick', 'Smelling Salts', 'Thunder Punch', 'Tickle']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Bullet Punch', 'Close Combat', 'Counter', 'Encore', 'Fire Punch', 'Heavy Slam', 'Ice Punch', 'Knock Off', 'Meditate', 'Power Trick', 'Quick Guard', 'Rolling Kick', 'Smelling Salts', 'Thunder Punch', 'Tickle']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Counter', 'Bullet Punch', 'Tickle', 'Quick Guard', 'Submission'], bdspOnly: ['Encore', 'Close Combat', 'Fire Punch', 'Thunder Punch', 'Ice Punch', 'Power Trick', 'Heavy Slam', 'Knock Off']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        }
    }
}, {
    name: "bellsprout",
    gen: 1,
    info: {
        natDexNum: 69,
        HA: {
            hasHA: true,
            name: {reg: "Gluttony"}
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Encore', 'Synthesis', 'Leech Life', 'Ingrain', 'Magical Leaf', 'Worry Seed', 'Tickle', 'Weather Ball', 'Bullet Seed', 'Natural Gift', 'Giga Drain', 'Clear Smog', 'Power Whip', 'Acid Spray', 'Belch']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Encore', 'Synthesis', 'Leech Life', 'Ingrain', 'Magical Leaf', 'Worry Seed', 'Tickle', 'Weather Ball', 'Bullet Seed', 'Natural Gift', 'Giga Drain', 'Clear Smog', 'Power Whip', 'Acid Spray', 'Belch'], usumOnly: ['Strength Sap']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Encore', 'Synthesis', 'Leech Life', 'Ingrain', 'Magical Leaf', 'Worry Seed', 'Tickle', 'Weather Ball', 'Clear Smog', 'Power Whip', 'Acid Spray', 'Belch', 'Strength Sap']},
            balls: {
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: false, haIsLegal: false},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        }, 
        gen9: {
            eggmoves: {moves: ['Synthesis', 'Ingrain', 'Tickle', 'Worry Seed', 'Sucker Punch', 'Clear Smog', 'Strength Sap']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "tentacool",
    gen: 1,
    info: {
        natDexNum: 72,
        HA: {
            hasHA: true,
            name: {reg: "Rain Dish"}
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Acupressure', 'Aqua Ring', 'Aurora Beam', 'Bubble', 'Confuse Ray', 'Haze', 'Knock Off', 'Mirror Coat', 'Muddy Water', 'Rapid Spin', 'Tickle']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Acupressure', 'Aqua Ring', 'Aurora Beam', 'Bubble', 'Confuse Ray', 'Haze', 'Knock Off', 'Mirror Coat', 'Muddy Water', 'Rapid Spin', 'Tickle']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Acupressure', 'Aqua Ring', 'Aurora Beam', 'Confuse Ray', 'Haze', 'Knock Off', 'Mirror Coat', 'Rapid Spin', 'Tickle'], bdspOnly: ['Muddy Water']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            eggmoves: {moves: ['Aurora Beam', 'Confuse Ray', 'Haze', 'Rapid Spin', 'Mirror Coat', 'Knock Off', 'Tickle', 'Acupressure', 'Aqua Ring']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "geodude",
    gen: 1,
    info: {
        natDexNum: 74,
        HA: {
            hasHA: true,
            name: {reg: "Sand Veil", alt1: "Galvanize"}
        },
        regionalForm: {
            forms: [{name: "Alolan", gen: 7}]
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Curse', 'Flail', 'Block', 'Wide Guard', 'Autotomize', 'Endure', 'Rock Climb', 'Mega Punch', 'Hammer Arm', 'Focus Punch']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Curse', 'Flail', 'Block', 'Wide Guard', 'Autotomize', 'Endure', 'Rock Climb'], regFormOnly: ['Mega Punch', 'Hammer Arm', 'Focus Punch'], regionalFormOnly: ['Magnet Rise', 'Counter', 'Screech']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Mega Punch', 'Block', 'Hammer Arm', 'Flail', 'Curse', 'Autotomize', 'Wide Guard']},
            balls: {
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: false, haIsLegal: false},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        }, 
        gen9: {
            eggmoves: {moves: ['Curse', 'Flail', 'Block', 'Wide Guard'], regFormOnly: ['Mega Punch', 'Dynamic Punch', 'Hammer Arm'], regionalFormOnly: ['Counter', 'Screech', 'Zap Cannon', 'Endure']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "ponyta",
    gen: 1,
    info: {
        natDexNum: 77,
        HA: {
            hasHA: true,
            name: {reg: "Flame Body", alt1: "Anticipation"}
        },
        regionalForm: {
            forms: [{name: "Galarian", gen: 8}]
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Ally Switch', 'Captivate', 'Charm', 'Double Kick', 'Double-Edge', 'Flame Wheel', 'Horn Drill', 'Hypnosis', 'Low Kick', 'Morning Sun', 'Thrash']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Ally Switch', 'Captivate', 'Charm', 'Double Kick', 'Double-Edge', 'Flame Wheel', 'Horn Drill', 'Hypnosis', 'Low Kick', 'Morning Sun', 'Thrash'], usumOnly: ['High Horsepower']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Thrash', 'Double Kick', 'Hypnosis', 'Double-Edge', 'Horn Drill', 'Morning Sun'], bdspOnly: ['Flame Wheel', 'Charm', 'Low Kick', 'Ally Switch', 'High Horsepower']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        }
    }
}, {
    name: "slowpoke",
    gen: 1,
    info: {
        natDexNum: 79,
        HA: {
            hasHA: true,
            name: {reg: "Regenerator", alt1: "Regenerator"}
        },
        regionalForm: {
            forms: [{name: "Galarian", gen: 8}]
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Belly Drum', 'Future Sight', 'Stomp', 'Mud Sport', 'Sleep Talk', 'Snore', 'Me First', 'Block', 'Zen Headbutt', 'Wonder Room', 'Belch']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Belly Drum', 'Future Sight', 'Stomp', 'Mud Sport', 'Sleep Talk', 'Snore', 'Me First', 'Block', 'Zen Headbutt', 'Wonder Room', 'Belch']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Stomp', 'Belly Drum', 'Block', 'Belch'], bdspOnly: ['Future Sight', 'Snore', 'Zen Headbutt', 'Wonder Room']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            eggmoves: {moves: ['Stomp', 'Belly Drum', 'Block', 'Belch']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "magnemite",
    gen: 1,
    info: {
        natDexNum: 81,
        HA: {
            hasHA: true,
            name: {reg: "Analytic"}
        }
    },
    specificGenInfo: {
        gen6: {
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: false}
            }
        }, 
        gen7: {
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            eggmoves: {moves: ['Explosion', 'Electroweb']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "farfetch'd",
    gen: 1,
    info: {
        natDexNum: 83,
        HA: {
            hasHA: true,
            name: {reg: "Defiant", alt1: "Scrappy"}
        },
        regionalForm: {
            forms: [{name: "Galarian", gen: 8}]
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Covet', 'Curse', 'Feather Dance', 'Flail', 'Foresight', 'Gust', 'Leaf Blade', 'Mirror Move', 'Mud-Slap', 'Night Slash', 'Quick Attack', 'Revenge', 'Roost', 'Simple Beam', 'Steel Wing', 'Trump Card']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Covet', 'Curse', 'Feather Dance', 'Flail', 'Foresight', 'Gust', 'Leaf Blade', 'Mirror Move', 'Mud-Slap', 'Night Slash', 'Quick Attack', 'Revenge', 'Roost', 'Simple Beam', 'Steel Wing', 'Trump Card'], usumOnly: ['First Impression', 'Final Gambit']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Quick Attack', 'Flail', 'Curse', 'Covet', 'Night Slash', 'Simple Beam', 'Feint', 'Sky Attack'], regFormOnly: ['Gust', 'Feather Dance', 'Final Gambit'], regionalFormOnly: ['Counter', 'Quick Guard', 'Double-Edge'], swshAndRegFormOnly: ['Roost', 'First Impression'], bdspOnly: ['Mud-Slap', 'Leaf Blade', 'Revenge']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        }
    }
}, {
    name: "doduo",
    gen: 1,
    info: {
        natDexNum: 84,
        HA: {
            hasHA: true,
            name: {reg: "Tangled Feet"}
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Quick Attack', 'Supersonic', 'Haze', 'Feint Attack', 'Flail', 'Endeavor', 'Mirror Move', 'Brave Bird', 'Natural Gift', 'Assurance']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Quick Attack', 'Supersonic', 'Haze', 'Feint Attack', 'Flail', 'Endeavor', 'Mirror Move', 'Brave Bird', 'Natural Gift', 'Assurance']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Quick Attack', 'Supersonic', 'Haze', 'Flail', 'Endeavor', 'Brave Bird', 'Assurance']},
            balls: {
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            eggmoves: {moves: ['Whirlwind', 'Sky Attack', 'Flail', 'Assurance']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "seel",
    gen: 1,
    info: {
        natDexNum: 86,
        HA: {
            hasHA: true,
            name: {reg: "Ice Body"}
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Belch', 'Disable', 'Encore', 'Entrainment', 'Fake Out', 'Horn Drill', 'Icicle Spear', 'Iron Tail', 'Lick', 'Perish Song', 'Signal Beam', 'Slam', 'Sleep Talk', 'Spit Up', 'Stockpile', 'Swallow', 'Water Pulse']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Belch', 'Disable', 'Encore', 'Entrainment', 'Fake Out', 'Horn Drill', 'Icicle Spear', 'Iron Tail', 'Lick', 'Perish Song', 'Signal Beam', 'Slam', 'Sleep Talk', 'Spit Up', 'Stockpile', 'Swallow', 'Water Pulse']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Lick', 'Perish Song', 'Disable', 'Horn Drill', 'Slam', 'Encore', 'Fake Out', 'Icicle Spear', 'Stockpile', 'Swallow', 'Spit Up', 'Belch', 'Entrainment']},
            balls: {
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            eggmoves: {moves: ['Horn Drill', 'Disable', 'Lick', 'Perish Song', 'Fake Out', 'Stockpile', 'Spit Up', 'Swallow', 'Entrainment', 'Belch']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "grimer",
    gen: 1,
    info: {
        natDexNum: 88,
        HA: {
            hasHA: true,
            name: {reg: "Poison Touch", alt1: "Power of Alchemy"}
        },
        regionalForm: {
            forms: [{name: 'Alolan', gen: 7}]
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Mean Look', 'Imprison', 'Curse', 'Shadow Sneak', 'Stockpile', 'Swallow', 'Spit Up', 'Scary Face', 'Haze', 'Lick', 'Shadow Punch', 'Acid Spray']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Mean Look', 'Imprison', 'Curse', 'Shadow Sneak', 'Stockpile', 'Swallow', 'Spit Up', 'Scary Face'], regFormOnly: ['Haze', 'Lick', 'Shadow Punch', 'Acid Spray'], regionalFormOnly: ['Clear Smog', 'Pursuit', 'Assurance', 'Spite'], usumOnly: ['Power-Up Punch']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Haze', 'Mean Look', 'Lick', 'Imprison', 'Curse', 'Shadow Punch', 'Shadow Sneak', 'Stockpile', 'Swallow', 'Spit Up', 'Scary Face', 'Acid Spray', 'Power-Up Punch']},
            balls: {
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: false, haIsLegal: false},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            eggmoves: {moves: ['Curse', 'Mean Look', 'Stockpile', 'Spit Up', 'Swallow', 'Shadow Sneak'], regFormOnly: ['Haze', 'Shadow Punch', 'Acid Spray'], regionalFormOnly: ['Spite', 'Recycle', 'Assurance', 'Clear Smog']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "shellder",
    gen: 1,
    info: {
        natDexNum: 90,
        HA: {
            hasHA: true,
            name: {reg: "Overcoat"}
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Aqua Ring', 'Avalanche', 'Barrier', 'Bubble Beam', 'Icicle Spear', 'Mud Shot', 'Rapid Spin', 'Rock Blast', 'Screech', 'Take Down', 'Twineedle', 'Water Pulse']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Bubble Beam', 'Take Down', 'Barrier', 'Rapid Spin', 'Screech', 'Icicle Spear', 'Mud Shot', 'Rock Blast', 'Water Pulse', 'Aqua Ring', 'Avalanche', 'Twineedle']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Bubble Beam', 'Aqua Ring', 'Life Dew'], swshOnly: ['Water Pulse'], bdspOnly: ['Take Down', 'Rapid Spin', 'Screech', 'Icicle Spear', 'Mud Shot', 'Rock Blast']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            eggmoves: {moves: ['Bubble Beam', 'Water Pulse', 'Aqua Ring', 'Life Dew']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "gastly",
    gen: 1,
    info: {
        natDexNum: 92,
        HA: {
            hasHA: false,
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Disable', 'Grudge', 'Haze', 'Smog', 'Perish Song', 'Astonish', 'Clear Smog', 'Reflect Type', 'Psywave', 'Fire Punch', 'Ice Punch', 'Thunder Punch', 'Scary Face']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Disable', 'Grudge', 'Haze', 'Smog', 'Perish Song', 'Astonish', 'Clear Smog', 'Reflect Type', 'Psywave', 'Fire Punch', 'Ice Punch', 'Thunder Punch', 'Scary Face']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Disable', 'Grudge', 'Haze', 'Smog', 'Perish Song', 'Astonish', 'Clear Smog', 'Reflect Type'], swshOnly: ['Toxic'], bdspOnly: ['Fire Punch', 'Ice Punch', 'Thunder Punch', 'Scary Face']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            eggmoves: {moves: ['Disable', 'Toxic', 'Haze', 'Smog', 'Perish Song', 'Astonish', 'Clear Smog', 'Reflect Type']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "onix",
    gen: 1,
    info: {
        natDexNum: 95,
        HA: {
            hasHA: true,
            name: {reg: "Weak Armor"}
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Block', 'Defense Curl', 'Flail', 'Heavy Slam', 'Rock Blast', 'Rock Climb', 'Rollout', 'Rototiller', 'Stealth Rock']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Block', 'Defense Curl', 'Flail', 'Heavy Slam', 'Rock Blast', 'Rock Climb', 'Rollout', 'Rototiller', 'Stealth Rock'], usumOnly: ['Wide Guard']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Flail', 'Block', 'Defense Curl', 'Wide Guard', 'Rollout', 'Dragon Tail', 'Head Smash'], bdspOnly: ['Rock Blast', 'Heavy Slam']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        }
    }
}, {
    name: "drowzee",
    gen: 1,
    info: {
        natDexNum: 96,
        HA: {
            hasHA: true,
            name: {reg: "Inner Focus"}
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Barrier', 'Assist', 'Nasty Plot', 'Secret Power', 'Skill Swap', 'Fire Punch', 'Ice Punch', 'Thunder Punch', 'Flatter', 'Role Play', 'Guard Swap', 'Psycho Cut']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Barrier', 'Assist', 'Nasty Plot', 'Secret Power', 'Skill Swap', 'Fire Punch', 'Ice Punch', 'Thunder Punch', 'Flatter', 'Role Play', 'Guard Swap', 'Psycho Cut'], usumOnly: ['Power Split', 'Psychic Terrain']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Fire Punch', 'Ice Punch', 'Thunder Punch', 'Flatter', 'Role Play', 'Guard Swap', 'Psycho Cut', 'Power Split']},
            balls: {
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: false, haIsLegal: false},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            eggmoves: {moves: ['Fire Punch', 'Ice Punch', 'Thunder Punch', 'Flatter', 'Role Play', 'Guard Swap', 'Psycho Cut', 'Power Split']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "krabby",
    gen: 1,
    info: {
        natDexNum: 98,
        HA: {
            hasHA: true,
            name: {reg: "Sheer Force"}
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Agility', 'Ally Switch', 'Amnesia', 'Ancient Power', 'Bide', 'Chip Away', 'Endure', 'Flail', 'Haze', 'Knock Off', 'Slam', 'Tickle']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Agility', 'Ally Switch', 'Amnesia', 'Ancient Power', 'Bide', 'Chip Away', 'Endure', 'Flail', 'Haze', 'Knock Off', 'Slam', 'Tickle']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Knock Off', 'Ancient Power', 'Hammer Arm', 'Slash', 'Night Slash'], bdspOnly: ['Haze', 'Amnesia', 'Flail', 'Slam', 'Tickle', 'Agility', 'Ally Switch']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        }
    }
}, {
    name: "voltorb",
    gen: 1,
    info: {
        natDexNum: 100,
        HA: {
            hasHA: true,
            name: {reg: "Aftermath", alt1: "Aftermath"}
        },
                

        regionalForm: {
            forms: [{name: 'Hisuian', gen: 9}]
        }
    },
    specificGenInfo: {
        gen6: {
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            balls: {
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            eggmoves: {moves: ['Recycle'], regionalFormOnly: ['Leech Seed', 'Worry Seed'], regFormOnly: ['Metal Sound']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "exeggcute",
    gen: 1,
    info: {
        natDexNum: 102,
        HA: {
            hasHA: true,
            name: {reg: "Harvest"}
        },
            
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Synthesis', 'Moonlight', 'Ancient Power', 'Ingrain', 'Curse', 'Nature Power', 'Lucky Chant', 'Leaf Storm', 'Power Swap', 'Giga Drain', 'Skill Swap', 'Natural Gift', 'Block', 'Grassy Terrain']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Synthesis', 'Moonlight', 'Ancient Power', 'Ingrain', 'Curse', 'Nature Power', 'Lucky Chant', 'Leaf Storm', 'Power Swap', 'Giga Drain', 'Skill Swap', 'Natural Gift', 'Block', 'Grassy Terrain']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Ancient Power', 'Block', 'Curse', 'Ingrain', 'Moonlight', 'Sleep Powder', 'Stun Spore', 'Poison Powder'], bdspOnly: ['Synthesis', 'Nature Power', 'Leaf Storm', 'Power Swap', 'Grassy Terrain']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            eggmoves: {moves: ['Poison Powder', 'Stun Spore', 'Sleep Powder', 'Curse', 'Moonlight', 'Ancient Power', 'Ingrain', 'Block']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: 'alolan Exeggutor',
    gen: 7,
    info: {
        natDexNum: 103,
        HA: {
            hasHA: true,
            name: {reg: "Harvest"} 
        },
        evolvedRegionalForm: true,
        species: 'Exeggutor'
    },
    specificGenInfo: {
        gen7: {
            eggmoves: {moves: ['Synthesis', 'Moonlight', 'Ancient Power', 'Ingrain', 'Curse', 'Nature Power', 'Lucky Chant', 'Leaf Storm', 'Power Swap', 'Giga Drain', 'Skill Swap', 'Natural Gift', 'Block', 'Grassy Terrain']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Ancient Power', 'Block', 'Curse', 'Ingrain', 'Moonlight', 'Sleep Powder', 'Stun Spore', 'Poison Powder']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            eggmoves: {moves: ['Poison Powder', 'Stun Spore', 'Sleep Powder', 'Curse', 'Moonlight', 'Ancient Power', 'Ingrain', 'Block']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "cubone",
    gen: 1,
    info: {
        natDexNum: 104,
        HA: {
            hasHA: true,
            name: {reg: "Rock Head"}
        },
            
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Ancient Power', 'Belly Drum', 'Chip Away', 'Detect', 'Double Kick', 'Endure', 'Iron Head', 'Perish Song', 'Screech', 'Skull Bash']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Ancient Power', 'Belly Drum', 'Screech', 'Skull Bash', 'Perish Song', 'Double Kick', 'Iron Head', 'Detect', 'Endure', 'Chip Away'], usumOnly: ['Curse']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Ancient Power', 'Belly Drum', 'Detect', 'Double Kick', 'Perish Song', 'Skull Bash', 'Curse', 'Leer'], bdspOnly: ['Screech', 'Iron Head']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        }
    }
}, {
    name: "alolan Marowak",
    gen: 7,
    info: {
        natDexNum: 105,
        HA: {
            hasHA: true,
            name: {reg: "Battle Armor"}
        },
        evolvedRegionalForm: true,
        species: 'Marowak'
    },
    specificGenInfo: {
        gen7: {
            eggmoves: {moves: ['Ancient Power', 'Belly Drum', 'Screech', 'Skull Bash', 'Perish Song', 'Double Kick', 'Iron Head', 'Detect', 'Endure', 'Chip Away'], usumOnly: ['Curse']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Ancient Power', 'Belly Drum', 'Detect', 'Double Kick', 'Perish Song', 'Skull Bash', 'Curse', 'Leer']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        }
    }
}, {
    name: "lickitung",
    gen: 1,
    info: {
        natDexNum: 108,
        HA: {
            hasHA: true,
            name: {reg: "Cloud Nine"}
        },
            
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Belly Drum', 'Magnitude', 'Body Slam', 'Curse', 'Smelling Salts', 'Sleep Talk', 'Snore', 'Amnesia', 'Hammer Arm', 'Muddy Water', 'Zen Headbutt', 'Belch']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Belly Drum', 'Magnitude', 'Body Slam', 'Curse', 'Smelling Salts', 'Sleep Talk', 'Snore', 'Amnesia', 'Hammer Arm', 'Muddy Water', 'Zen Headbutt', 'Belch'], bdspOnly: ['Thrash']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Belch', 'Curse', 'Hammer Arm', 'Thrash'], bdspOnly: ['Belly Drum', 'Body Slam', 'Snore', 'Amnesia', 'Muddy Water', 'Zen Headbutt']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        }
    }
}, {
    name: "koffing",
    gen: 1,
    info: {
        natDexNum: 109,
        HA: {
            hasHA: true, //HA introduced in gen 8. haIsLegal fields ensure its not taken to those gens.
            name: {reg: "Stench"}
        }      
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Curse', 'Destiny Bond', 'Grudge', 'Pain Split', 'Psybeam', 'Psywave', 'Screech', 'Spit Up', 'Spite', 'Stockpile', 'Swallow', 'Toxic Spikes']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: false}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Curse', 'Destiny Bond', 'Grudge', 'Pain Split', 'Psybeam', 'Psywave', 'Screech', 'Spit Up', 'Spite', 'Stockpile', 'Swallow', 'Toxic Spikes'], usumOnly: ['Venom Drench']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: false}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Psybeam', 'Pain Split', 'Grudge', 'Spite', 'Curse', 'Stockpile', 'Swallow', 'Spit Up'], bdspOnly: ['Screech', 'Destiny Bond', 'Toxic Spikes', 'Venom Drench']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            eggmoves: {moves: ['Curse', 'Spite', 'Pain Split', 'Stockpile', 'Swallow', 'Spit Up']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "galarian Weezing",
    gen: 8,
    info: {
        natDexNum: 110,
        HA: {
            hasHA: true,
            name: {reg: "Misty Surge"}
        },
        evolvedRegionalForm: true,   
        species: 'Weezing'
    },
    specificGenInfo: {
        gen8: {
            eggmoves: {moves: ['Psybeam', 'Pain Split', 'Grudge', 'Spite', 'Curse', 'Stockpile', 'Swallow', 'Spit Up']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            eggmoves: {moves: ['Curse', 'Spite', 'Pain Split', 'Stockpile', 'Swallow', 'Spit Up']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "rhyhorn",
    gen: 1,
    info: {
        natDexNum: 111,
        HA: {
            hasHA: true,
            name: {reg: "Reckless"}
        },
            
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Crunch', 'Reversal', 'Counter', 'Magnitude', 'Curse', 'Crush Claw', 'Dragon Rush', 'Ice Fang', 'Fire Fang', 'Thunder Fang', 'Skull Bash', 'Iron Tail', 'Rock Climb', 'Rototiller', 'Metal Burst', 'Guard Split']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Crunch', 'Reversal', 'Counter', 'Magnitude', 'Curse', 'Crush Claw', 'Dragon Rush', 'Ice Fang', 'Fire Fang', 'Thunder Fang', 'Skull Bash', 'Iron Tail', 'Rock Climb', 'Rototiller', 'Metal Burst', 'Guard Split']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Counter', 'Curse', 'Dragon Rush', 'Skull Bash', 'Metal Burst', 'Guard Split'], swshOnly: ['Rock Polish'], bdspOnly: ['Crunch', 'Reversal', 'Crush Claw', 'Ice Fang', 'Fire Fang', 'Thunder Fang']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            eggmoves: {moves: ['Counter', 'Curse', 'Metal Burst', 'Rock Polish', 'Dragon Rush', 'Guard Split']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "Chansey",
    gen: 1,
    info: {
        natDexNum: 113,
        HA: {
            hasHA: true,
            name: {reg: "Healer"}
        },
        special: {
            incenseMon: true,
            child: {
                name: "happiny",
                gen: 4,
                natDexNum: 440,
                hasHA: true,
                haName: "Friend Guard"
            }
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Aromatherapy', 'Counter', 'Endure', 'Gravity', 'Heal Bell', 'Helping Hand', 'Metronome', 'Mud Bomb', 'Natural Gift', 'Present', 'Seismic Toss']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Aromatherapy', 'Counter', 'Endure', 'Gravity', 'Heal Bell', 'Helping Hand', 'Metronome', 'Mud Bomb', 'Natural Gift', 'Present', 'Seismic Toss']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Aromatherapy', 'Gravity', 'Present', 'Seismic Toss'], bdspOnly: ['Metronome', 'Heal Bell', 'Counter', 'Helping Hand']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            eggmoves: {moves: ['Heal Bell', 'Gravity', 'Present', 'Seismic Toss']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "tangela",
    gen: 1,
    info: {
        natDexNum: 114,
        HA: {
            hasHA: true,
            name: {reg: "Regenerator"}
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Confusion', 'Endeavor', 'Flail', 'Leech Seed', 'Nature Power', 'Rage Powder', 'Mega Drain', 'Amnesia', 'Leaf Storm', 'Power Swap', 'Giga Drain', 'Natural Gift']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Confusion', 'Endeavor', 'Flail', 'Leech Seed', 'Nature Power', 'Rage Powder', 'Mega Drain', 'Amnesia', 'Leaf Storm', 'Power Swap', 'Giga Drain', 'Natural Gift'], usumOnly: ['Wake-Up Slap']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Confusion', 'Endeavor', 'Flail', 'Leech Seed', 'Nature Power', 'Rage Powder'], bdspOnly: ['Mega Drain', 'Amnesia', 'Leaf Storm', 'Power Swap']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        }
    }
}, {
    name: "Kangaskhan",
    gen: 1,
    info: {
        natDexNum: 115,
        HA: {
            hasHA: true,
            name: {reg: "Inner Focus"}
        }
    
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Circle Throw', 'Counter', 'Crush Claw', 'Disable', 'Double-Edge', 'Endeavor', 'Focus Energy', 'Focus Punch', 'Foresight', 'Hammer Arm', 'Stomp', 'Trump Card', 'Uproar']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Circle Throw', 'Counter', 'Crush Claw', 'Disable', 'Double-Edge', 'Endeavor', 'Focus Energy', 'Focus Punch', 'Foresight', 'Hammer Arm', 'Stomp', 'Trump Card', 'Uproar']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Circle Throw', 'Counter', 'Disable', 'Double-Edge', 'Endeavor', 'Hammer Arm'], bdspOnly: ['Stomp', 'Focus Energy', 'Crush Claw', 'Uproar']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        }
    }
}, {
    name: "horsea",
    gen: 1,
    info: {
        natDexNum: 116,
        HA: {
            hasHA: true,
            name: {reg: "Damp"}
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Flail', 'Aurora Beam', 'Octazooka', 'Disable', 'Splash', 'Dragon Rage', 'Dragon Breath', 'Signal Beam', 'Razor Wind', 'Muddy Water', 'Water Pulse', 'Clear Smog', 'Outrage']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Flail', 'Aurora Beam', 'Octazooka', 'Disable', 'Splash', 'Dragon Rage', 'Dragon Breath', 'Signal Beam', 'Razor Wind', 'Muddy Water', 'Water Pulse', 'Clear Smog', 'Outrage']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Aurora Beam', 'Clear Smog', 'Disable', 'Flail', 'Octazooka', 'Splash'], swshOnly: ['Water Pulse'], bdspOnly: ['Dragon Breath', 'Muddy Water', 'Outrage']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            eggmoves: {moves: ['Disable', 'Aurora Beam', 'Splash', 'Flail', 'Clear Smog']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "goldeen",
    gen: 1,
    info: {
        natDexNum: 118,
        HA: {
            hasHA: true,
            name: {reg: "Lightningrod"}
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Aqua Tail', 'Body Slam', 'Haze', 'Hydro Pump', 'Mud Shot', 'Mud Sport', 'Mud-Slap', 'Psybeam', 'Signal Beam', 'Skull Bash', 'Sleep Talk']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Aqua Tail', 'Body Slam', 'Haze', 'Hydro Pump', 'Mud Shot', 'Mud Sport', 'Mud-Slap', 'Psybeam', 'Signal Beam', 'Skull Bash', 'Sleep Talk']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Psybeam', 'Haze', 'Aqua Tail', 'Acupressure', 'Mud-Slap'], bdspOnly: ['Hydro Pump', 'Body Slam', 'Mud Shot', 'Skull Bash']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        }
    }
}, {
    name: 'staryu',
    gen: 1,
    info: {
        natDexNum: 120,
        HA: {
            hasHA: true,
            name: {reg: 'Analytic'}
        }
    },
    specificGenInfo: {
        gen6: {
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        },
        gen7: {
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        },
        gen8: {
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        }
    }
}, {
    name: "mr. Mime",
    gen: 1,
    info: {
        natDexNum: 122,
        HA: {
            hasHA: true,
            name: {reg: "Technician", alt1: "Ice Body"}
        },
        special: {
            incenseMon: true,
            child: {
                name: "mime Jr.",
                gen: 4,
                natDexNum: 439,
                hasHA: true,
                haName: "Technician"
            }
        },
        regionalForm: {
            forms: [{name: "Galarian", gen: 8}]
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Future Sight', 'Hypnosis', 'Mimic', 'Fake Out', 'Trick', 'Confuse Ray', 'Wake-Up Slap', 'Teeter Dance', 'Nasty Plot', 'Power Split', 'Magic Room', 'Icy Wind'], babyFormOnly: ['Healing Wish', 'Charm']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Future Sight', 'Hypnosis', 'Mimic', 'Fake Out', 'Trick', 'Confuse Ray', 'Wake-Up Slap', 'Teeter Dance', 'Nasty Plot', 'Power Split', 'Magic Room', 'Icy Wind'], babyFormOnly: ['Healing Wish', 'Charm'], usumOnly: ['Psychic Terrain']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Fake Out', 'Confuse Ray', 'Power Split', 'Tickle'], regFormOnly: ['Hypnosis'], regionalFormOnly: [], bdspOnly: ['Future Sight', 'Mimic', 'Trick', 'Teeter Dance', 'Magic Room', 'Icy Wind'], bdspAndbabyFormOnly: ['Healing Wish', 'Charm']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        }
    }
}, {
    name: "scyther",
    gen: 1,
    info: {
        natDexNum: 123,
        HA: {
            hasHA: true,
            name: {reg: "Steadfast"}
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Baton Pass', 'Bug Buzz', 'Counter', 'Defog', 'Endure', 'Night Slash', 'Quick Guard', 'Razor Wind', 'Reversal', 'Silver Wind', 'Steel Wing']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: true, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Baton Pass', 'Bug Buzz', 'Counter', 'Defog', 'Endure', 'Night Slash', 'Quick Guard', 'Razor Wind', 'Reversal', 'Silver Wind', 'Steel Wing']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Counter', 'Night Slash', 'Feint', 'Quick Guard'], swshOnly: ['Defog'], bdspOnly: ['Baton Pass', 'Reversal']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            eggmoves: {moves: ['Counter', 'Feint', 'Night Slash', 'Defog', 'Quick Guard']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "jynx",
    gen: 1,
    info: {
        natDexNum: 124,
        HA: {
            hasHA: true,
            name: {reg: "Dry Skin"}
        },
        special: {
            hasBabyMon: true,
            child: {
                name: "smoochum",
                gen: 2,
                natDexNum: 238,
                hasHA: true,
                haName: {reg: "Hydration"}
            }
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Meditate', 'Fake Out', 'Wish', 'Ice Punch', 'Miracle Eye', 'Nasty Plot', 'Wake-Up Slap', 'Captivate']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        },
        gen7: {
            eggmoves: {moves: ['Meditate', 'Fake Out', 'Wish', 'Ice Punch', 'Miracle Eye', 'Nasty Plot', 'Wake-Up Slap', 'Captivate']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        },
        gen8: {
            eggmoves: {moves: ['Fake Out', 'Wish', 'Role Play'], bdspOnly: ['Ice Punch']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        }
    }
}, {
    name: "electabuzz",
    gen: 1,
    info: {
        natDexNum: 125,
        HA: {
            hasHA: true,
            name: {reg: "Vital Spirit"}
        },
        special: {
            hasBabyMon: true,
            child: {
                name: 'elekid',
                gen: 2,
                natDexNum: 239
            }
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Barrier', 'Cross Chop', 'Dynamic Punch', 'Feint', 'Fire Punch', 'Focus Punch', 'Hammer Arm', 'Ice Punch', 'Karate Chop', 'Meditate', 'Rolling Kick']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        },
        gen7: {
            eggmoves: {moves: ['Barrier', 'Cross Chop', 'Dynamic Punch', 'Feint', 'Fire Punch', 'Focus Punch', 'Hammer Arm', 'Ice Punch', 'Karate Chop', 'Meditate', 'Rolling Kick']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        },
        gen8: {
            eggmoves: {moves: ['Cross Chop', 'Dynamic Punch', 'Hammer Arm', 'Feint'], swshOnly: ['Focus Punch'], bdspOnly: ['Fire Punch', 'Ice Punch']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            eggmoves: {moves: ['Dynamic Punch', 'Cross Chop', 'Focus Punch', 'Follow Me', 'Hammer Arm', 'Feint']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "magmar",
    gen: 1,
    info: {
        natDexNum: 126,
        HA: {
            hasHA: true,
            name: {reg: "Vital Spirit"}
        },
        special: {
            hasBabyMon: true,
            child: {
                name: 'magby',
                gen: 2,
                natDexNum: 240
            }
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Karate Chop', 'Mega Punch', 'Barrier', 'Screech', 'Cross Chop', 'Thunder Punch', 'Mach Punch', 'Dynamic Punch', 'Flare Blitz', 'Belly Drum', 'Iron Tail', 'Focus Energy', 'Power Swap', 'Belch']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        },
        gen7: {
            eggmoves: {moves: ['Karate Chop', 'Mega Punch', 'Barrier', 'Screech', 'Cross Chop', 'Thunder Punch', 'Mach Punch', 'Dynamic Punch', 'Flare Blitz', 'Belly Drum', 'Iron Tail', 'Focus Energy', 'Power Swap', 'Belch']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        },
        gen8: {
            eggmoves: {moves: ['Belch', 'Dynamic Punch', 'Mach Punch', 'Cross Chop'], swshOnly: ['Focus Punch'], bdspOnly: ['Mega Punch', 'Screech', 'Thunder Punch', 'Flare Blitz', 'Belly Drum', 'Focus Energy', 'Power Swap']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            eggmoves: {moves: ['Mach Punch', 'Belly Drum', 'Dynamic Punch', 'Cross Chop', 'Focus Punch', 'Follow Me', 'Belch']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "pinsir",
    gen: 1,
    info: {
        natDexNum: 127,
        HA: {
            hasHA: true,
            name: {reg: "Moxie"}
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Bug Bite', 'Close Combat', 'Feint', 'Feint Attack', 'Flail', 'Fury Attack', 'Me First', 'Quick Attack', 'Superpower']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: true, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Bug Bite', 'Close Combat', 'Feint', 'Feint Attack', 'Flail', 'Fury Attack', 'Me First', 'Quick Attack', 'Superpower']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Feint', 'Flail', 'Thrash', 'Fury Attack', 'Quick Attack'], bdspOnly: ['Close Combat', 'Bug Bite', 'Superpower']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        }
    }
}, {
    name: "tauros",
    gen: 1,
    info: {
        natDexNum: 128,
        HA: {
            hasHA: true,
            name: {reg: "Sheer Force", alt1: "Cud Chew"}
        },
        regionalForm: {
            forms: [{name: "Paldean", special: ['Blaze', 'Aqua'], gen: 9}]
        }
    },
    specificGenInfo: {
        gen6: {
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            eggmoves: {moves: ['Curse', 'Endeavor']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "magikarp",
    gen: 1,
    info: {
        natDexNum: 129,
        HA: {
            hasHA: true,
            name: {reg: "Rattled"}
        }
    
    },
    specificGenInfo: {
        gen6: {
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "lapras",
    gen: 1,
    info: {
        natDexNum: 131,
        HA: {
            hasHA: true,
            name: {reg: "Hydration"}
        }
    
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Foresight', 'Tickle', 'Refresh', 'Dragon Dance', 'Curse', 'Sleep Talk', 'Horn Drill', 'Ancient Power', 'Whirlpool', 'Fissure', 'Dragon Pulse', 'Avalanche', 'Future Sight', 'Freeze-Dry']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Foresight', 'Tickle', 'Refresh', 'Dragon Dance', 'Curse', 'Sleep Talk', 'Horn Drill', 'Ancient Power', 'Whirlpool', 'Fissure', 'Dragon Pulse', 'Avalanche', 'Future Sight', 'Freeze-Dry']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Tickle', 'Curse', 'Horn Drill', 'Ancient Power', 'Fissure', 'Freeze-Dry'], swshOnly: ['Sparkling Aria'], bdspOnly: ['Dragon Dance', 'Whirlpool', 'Future Sight']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            eggmoves: {moves: ['Horn Drill', 'Fissure', 'Curse', 'Ancient Power', 'Tickle', 'Freeze-Dry', 'Sparkling Aria']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "ditto",
    gen: 1,
    info: {
        natDexNum: 132,
        HA: {
            hasHA: true,
            name: {reg: "Imposter"}
        },
        nonBreedable: true
    },
    specificGenInfo: {
        gen6: {
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: false, haIsLegal: false}
            }
        },
        gen7: {
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: false, haIsLegal: false}
            }
        },
        gen8: {
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "eevee",
    gen: 1,
    info: {
        natDexNum: 133,
        HA: {
            hasHA: true,
            name: {reg: "Anticipation"}
        }
    
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Captivate', 'Charm', 'Covet', 'Curse', 'Detect', 'Endure', 'Fake Tears', 'Flail', 'Natural Gift', 'Stored Power', 'Synchronoise', 'Tickle', 'Wish', 'Yawn']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Captivate', 'Charm', 'Covet', 'Curse', 'Detect', 'Endure', 'Fake Tears', 'Flail', 'Natural Gift', 'Stored Power', 'Synchronoise', 'Tickle', 'Wish', 'Yawn']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Flail', 'Curse', 'Tickle', 'Yawn', 'Detect', 'Double Kick', 'Mud-Slap', 'Wish'], bdspOnly: ['Charm', 'Fake Tears', 'Covet', 'Stored Power']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            eggmoves: {moves: ['Double Kick', 'Curse', 'Flail', 'Mud-Slap', 'Detect', 'Wish', 'Yawn', 'Tickle']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "porygon",
    gen: 1,
    info: {
        natDexNum: 137,
        HA: {
            hasHA: true,
            name: {reg: "Analytic"}
        }
    
    },
    specificGenInfo: {
        gen6: {
            balls: {
                apriball: {isLegal: false, haIsLegal: false},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            balls: {
                apriball: {isLegal: false, haIsLegal: false},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "omanyte",
    gen: 1,
    info: {
        natDexNum: 138,
        HA: {
            hasHA: true,
            name: {reg: "Weak Armor"}
        }
    
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Bubble Beam', 'Aurora Beam', 'Slam', 'Supersonic', 'Haze', 'Spikes', 'Knock Off', 'Wring Out', 'Toxic Spikes', 'Muddy Water', 'Bide', 'Water Pulse', 'Whirlpool', 'Reflect Type']},
            balls: {
                apriball: {isLegal: false, haIsLegal: false},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Bubble Beam', 'Aurora Beam', 'Slam', 'Supersonic', 'Haze', 'Spikes', 'Knock Off', 'Wring Out', 'Toxic Spikes', 'Muddy Water', 'Bide', 'Water Pulse', 'Whirlpool', 'Reflect Type']},
            balls: {
                apriball: {isLegal: false, haIsLegal: false},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Aurora Beam', 'Bubble Beam', 'Haze', 'Knock Off', 'Reflect Type', 'Slam', 'Supersonic', 'Bite', 'Tickle'], swshOnly: ['Water Pulse'], bdspOnly: ['Spikes', 'Toxic Spikes', 'Muddy Water', 'Whirlpool']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        }
    }
}, {
    name: "kabuto",
    gen: 1,
    info: {
        natDexNum: 140,
        HA: {
            hasHA: true,
            name: {reg: "Weak Armor"}
        }
    
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Aurora Beam', 'Bubble Beam', 'Confuse Ray', 'Flail', 'Foresight', 'Giga Drain', 'Icy Wind', 'Knock Off', 'Mud Shot', 'Rapid Spin', 'Screech', 'Take Down']},
            balls: {
                apriball: {isLegal: false, haIsLegal: false},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Aurora Beam', 'Bubble Beam', 'Confuse Ray', 'Flail', 'Foresight', 'Giga Drain', 'Icy Wind', 'Knock Off', 'Mud Shot', 'Rapid Spin', 'Screech', 'Take Down']},
            balls: {
                apriball: {isLegal: false, haIsLegal: false},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Aurora Beam', 'Bubble Beam', 'Confuse Ray', 'Flail', 'Knock Off', 'Rapid Spin', 'Take Down', 'Mega Drain'], bdspOnly: ['Mud Shot', 'Icy Wind', 'Screech']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        }
    }
}, {
    name: "aerodactyl",
    gen: 1,
    info: {
        natDexNum: 142,
        HA: {
            hasHA: true,
            name: {reg: "Unnerve"}
        }
    
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Whirlwind', 'Pursuit', 'Foresight', 'Steel Wing', 'Dragon Breath', 'Curse', 'Assurance', 'Roost', 'Tailwind', 'Wide Guard']},
            balls: {
                apriball: {isLegal: false, haIsLegal: false},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Whirlwind', 'Pursuit', 'Foresight', 'Steel Wing', 'Dragon Breath', 'Curse', 'Assurance', 'Roost', 'Tailwind', 'Wide Guard']},
            balls: {
                apriball: {isLegal: false, haIsLegal: false},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Curse', 'Dragon Breath', 'Tailwind', 'Whirlwind', 'Wide Guard'], swshOnly: ['Roost'], bdspOnly: ['Assurance']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        }
    }
}, {
    name: "snorlax",
    gen: 1,
    info: {
        natDexNum: 143,
        HA: {
            hasHA: true,
            name: {reg: "Gluttony"}
        },
        special: {
            incenseMon: true,
            child: {
                name: "munchlax",
                gen: 4,
                natDexNum: 446
            }
        }
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['After You', 'Belch', 'Charm', 'Counter', 'Curse', 'Double-Edge', 'Lick', 'Natural Gift', 'Pursuit', 'Whirlwind'], adultFormOnly: ['Fissure'], babyFormOnly: ['Self-Destruct', 'Zen Headbutt']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['After You', 'Belch', 'Charm', 'Counter', 'Curse', 'Double-Edge', 'Lick', 'Natural Gift', 'Pursuit', 'Whirlwind'], adultFormOnly: ['Fissure'], babyFormOnly: ['Self-Destruct', 'Zen Headbutt'], usumOnly: ['Power-Up Punch']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Double-Edge', 'Curse', 'Fissure', 'Counter'], adultFormOnly: ['Gastro Acid'], babyFormOnly: ['Belch'], bdspOnly: ['Lick', 'Charm', 'Whirlwind', 'After You'], bdspAndadultFormOnly: ['Belch', 'Power-Up Punch'], bdspAndbabyFormOnly: ['Self-Destruct', 'Zen Headbutt']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            eggmoves: {moves: ['Double-Edge', 'Counter', 'Fissure', 'Curse', 'Belch']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "articuno",
    gen: 1,
    info: {
        natDexNum: 144,
        HA: {
            hasHA: true,
            name: {reg: 'Snow Cloak'}
        },
        regionalForm: {
            forms: [{name: "Galarian", gen: 8}]
        },
        legendary: true
    },
    specificGenInfo: {
        gen6: {
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: false, haIsLegal: false}
            }
        }, 
        gen7: {
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: false},
                dream: {isLegal: false, haIsLegal: false}
            }
        },
        gen8: {
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "zapdos",
    gen: 1,
    info: {
        natDexNum: 145,
        HA: {
            hasHA: true,
            name: {reg: 'Static'}
        },
        regionalForm: {
            forms: [{name: "Galarian", gen: 8}]
        },
        legendary: true
    },
    specificGenInfo: {
        gen6: {
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: false, haIsLegal: false}
            }
        }, 
        gen7: {
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: false},
                dream: {isLegal: false, haIsLegal: false}
            }
        },
        gen8: {
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            } 
        },
        gen9: {
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "moltres",
    gen: 1,
    info: {
        natDexNum: 146,
        HA: {
            hasHA: true,
            name: {reg: 'Flame Body'}
        },
        regionalForm: {
            forms: [{name: "Galarian", gen: 8}]
        },
        legendary: true
    },
    specificGenInfo: {
        gen6: {
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: false, haIsLegal: false}
            }
        }, 
        gen7: {
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: false},
                dream: {isLegal: false, haIsLegal: false}
            }
        },
        gen8: {
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "dratini",
    gen: 1,
    info: {
        natDexNum: 147,
        HA: {
            hasHA: true,
            name: {reg: "Marvel Scale"}
        }
    
    },
    specificGenInfo: {
        gen6: {
            eggmoves: {moves: ['Supersonic', 'Mist', 'Dragon Breath', 'Extreme Speed', 'Water Pulse', 'Aqua Jet', 'Haze', 'Dragon Dance', 'Dragon Rush', 'Dragon Pulse', 'Iron Tail']},
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: true, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen7: {
            eggmoves: {moves: ['Supersonic', 'Mist', 'Dragon Breath', 'Extreme Speed', 'Water Pulse', 'Aqua Jet', 'Haze', 'Dragon Dance', 'Dragon Rush', 'Dragon Pulse', 'Iron Tail']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }, 
        gen8: {
            eggmoves: {moves: ['Aqua Jet', 'Dragon Breath', 'Extreme Speed', 'Mist', 'Supersonic'], swshOnly: ['Water Pulse'], bdspOnly: ['Haze', 'Dragon Dance', 'Dragon Rush']},
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            eggmoves: {moves: ['Supersonic', 'Mist', 'Dragon Breath', 'Extreme Speed', 'Water Pulse', 'Aqua Jet']},
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, {
    name: "mewtwo",
    gen: 1,
    info: {
        natDexNum: 150,
        HA: {
            hasHA: true,
            name: {reg: 'Pressure', alt1: 'Unnerve'}
        },
        legendary: true
    },
    specificGenInfo: {
        gen6: {
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: false, haIsLegal: false},
                dream: {isLegal: false, haIsLegal: false}
            }
        }, 
        gen7: {
            balls: {
                apriball: {isLegal: true, haIsLegal: false},
                safari: {isLegal: false, haIsLegal: false},
                sport: {isLegal: false, haIsLegal: false},
                beast: {isLegal: true, haIsLegal: false},
                dream: {isLegal: false, haIsLegal: false}
            }
        },
        gen8: {
            balls: {
                swsh: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                },
                bdsp: {
                    apriball: {isLegal: true, haIsLegal: true},
                    safari: {isLegal: true, haIsLegal: true},
                    sport: {isLegal: true, haIsLegal: true},
                    beast: {isLegal: true, haIsLegal: true},
                    dream: {isLegal: true, haIsLegal: true}
                }
            }
        },
        gen9: {
            balls: {
                apriball: {isLegal: true, haIsLegal: true},
                safari: {isLegal: true, haIsLegal: true},
                sport: {isLegal: true, haIsLegal: true},
                beast: {isLegal: true, haIsLegal: true},
                dream: {isLegal: true, haIsLegal: true}
            }
        }
    }
}, ]

export default gen1Info;