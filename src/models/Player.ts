import { DatabaseModel, DriverClass, PlayerType } from "./types";

export class Player extends DatabaseModel {
    private _playerId: number
    private _customerId: number
    private _playerTypeId: PlayerType
    private _stockClassicClass: DriverClass
    private _stockMuscleClass: DriverClass
    private _modifiedClassicClass: DriverClass
    private _modifiedMuscleClass: DriverClass
    private _outlawClass: DriverClass
    private _dragClass: DriverClass
    private _challengeScore
    private _challengeRung
    private _lastLoggedIn
    private _totalTimePlayed
    private _timesLoggedIn
    private _numUnreadMain
    private _bankBalance
    private _numCarsOwned
    private _isLoggedIn
    private _driverStyle
    private _lpCode
    private _carInfoSetting
    private _carNum1
    private _carNum2
    private _carNum3
    private _carNum4
    private _carNum5
    private _carNum6
    private _lpText
    private _dlNumber
    private _persona
    private _address
    private _residence

}
