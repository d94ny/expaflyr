# Expaflyr

## Overview

Expaflyr is a clean and simple network for students at the EPFL.

## Database Collections

The format and syntax for each database entry per collection. The `expadb` contains following collections :

- users
- events
- assos

### Users 
Users are characterized by :

| Field | Type | Example |
| --  | -- | -- |
| \_id | `ObjectId()` | ` ObjectId("5203e122294780dd565a6936") ` |
| username | `String` | ` balle ` |
| name | `String` | ` Daniel Balle` |
| password | `String` | 
| kudos | `Int` | ` 4523` |
| friends | `List[String]`| ` [  "balle",  "devander" ]` |
| assos | `List[String]` | ` [ "agepoly", "clic"]` |
| activity | `List[Objects]` | see below section **Feed - Activity** |
| cirruculum | `List[Objects]` | see below section **Feed - Cirruculum** |

### Events
Events are characterized by :

| Field | Type | Example |
| -- | -- | -- |
| \_id | `ObjectId()` | `ObjectId("5203e122294780dd565a6936")` |
| name | `String` | `"Best party ever"` |
| location | `String` | `"INJ 234"` |
| sections | `List[(String,Int)]` | `[("IN",31), ("SV",54)]` |
| assos | `String` | `"Ageploy"` |
| date | `Javascript Timestamp` | `1359748800000` |
| creator | `String` | `"balle"` |

## Feed

This sections contains building bricks of the feed

### Activity
The activities of a user or association are all his public actions.

_Example : Daniel attends Best Party Ever, Agepoly throws PolyLAN, Dennis follows Agepoly …_

#### Format
Here is what an entry of the activity might look like:

	{
		"kind" : "attends",
		"time" : 1378058346808,
		"user" : "danny",
		"content" : { … }
	}

All these fields are mandatory.
`content` contains info necessary for the graphical display of the activity.

#### Fields
There are different kinds of activities and what content they require :

| Kind  			| Description | Content | 
| ----- 			| --------  | -- |
| `attends` 		| a user attends an event | `event: { name, location, sections, assos, date, creator, _id }`|
| `throws` 		| an association throws an event  |
| `created`      | a user created an event | `event: { name, location, sections, assos, date, creator, _id }` |



### Curriculum
The curriculum of a user is a list of his private action which modified his kudos.

_Example : You created Best party Ever +100, You follow Agepoly +5, Someone added you +20 …_

#### Format
Here is what an entry of an curriculum might look like:

	{
		"kind" : "attendsYour",
		"time" : 1378058346808,
		"user" : "danny",
		"content" : { … }
	}

Note here that Activites and Curriculum do not differ in format but only in purpose.

#### Fields

| Kind  			| Description | Content | 
| ----- 			| --------  | -- |
| `attendsYour` 		| another user attends an event the user created  | `{ 	"name" : "name", 	"kudos" : 1 }`|
| `throws` 		| an association throws an event  |
| `created`      | a user created an event | `event: { name, location, sections, assos, date, creator, _id }` |

Every content field contains a field for how many kudos were received from that action.