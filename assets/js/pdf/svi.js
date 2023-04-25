class SVIPDF extends PDFReg {
    PDF = "play-pokemon-deck-list-a4-svi-long.pdf"
    LINE_HEIGHT = 13
    LINE_OFFSET = 1

    FIELDS = {
        "trainer_data": {
            "name": "Trainer Data",
            "fields": {
                "trainer_data_name": {
                    "name": "Name",
                    "position": "90,760",
                },
                "play_pokemon_id": {
                    "name": "Play! Pokemon ID",
                    "position": "273,760",
                },
                "birth_date_day": {
                    "name": "Day of Birth",
                    "position": "513,760",
                },
                "birth_date_month": {
                    "name": "Month of Birth",
                    "position": "486,760",
                },
                "birth_date_year": {
                    "name": "Year of Birth",
                    "position": "541,760",
                },
                "age_division": {
                    "name": "Age Division",
                    "check": {
                        "Master": "366,696",
                        "Senior": "366,710",
                        "Junior": "366,723",
                    }
                },
            },
        },
        "pokemon": {
            "name": "Pokémons",
            "quantity": 15,
            "fields": {
                "pokemon_qty": {
                    "name": "Quantity",
                    "position": "261,644",
                },
                "pokemon_name": {
                    "name": "Name",
                    "position": "287,644",
                },
                "set": {
                    "name": "Set",
                    "position": "463,644",
                },
                "coll": {
                    "name": "Collector Number",
                    "position": "500,644",
                },
                "reg": {
                    "name": "Regulation",
                    "position": "542,644",
                },
            },
        },
        "trainers": {
            "name": "Trainers",
            "quantity": 18,
            "fields": {
                "trainer_qty": {
                    "name": "Quantity",
                    "position": "261,406",
                },
                "trainer_name": {
                    "name": "Name",
                    "position": "287,406",
                },
            },
        },
        "energy": {
            "name": "Energy",
            "quantity": 4,
            "fields": {
                "energy_qty": {
                    "name": "Quantity",
                    "position": "261,125",
                },
                "energy_name": {
                    "name": "Name",
                    "position": "287,125",
                },
            },
        },
    };
}