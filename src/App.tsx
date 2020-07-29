import React, { useState } from 'react';
import './App.css';

// Global Enum of Attack Types
 enum AttackType {
  Deflect = 1,
  Parry = 2,
  HeavyStrike = 3,
  FastStrike = 4
}

// Enemy health bar to render to view.
const EnemyHealthBar: React.FC<any> = (props) => {
  const detectStat = (stat:number, perception:number) => {
    if(perception >= (stat * 0.75))
    {
      return stat;
    } 
    else{ 
      return '?';
    }
}
  // Show enemy stats only if the players perception beats a check
  // In this case, Perception must be greater than 75% of the Statistic for it to be visible
  return(
    
      <div style={{border: '3px grey ridge', padding: '5px'}}>
       <p>Big Bad Baddie</p>
        <span>H: { detectStat(props.health, props.playerPerception) } || S: {detectStat(props.strength, props.playerPerception)} || A: {detectStat(props.agility, props.playerPerception)} </span>
      </div>
    
  )
}

const PlayerBar: React.FC<any> = (props) => {

  // Show enemy stats only if the players perception beats a check
  // In this case, Perception must be greater than 75% of the Statistic for it to be visible
  return(
    <>
      <br/>
      <span>H: { props.health } || S: { props.strength } || A: { props.agility } || P: {props.perception} </span>
      <br/>
      
    </>
  )
}


function App() {

  const [battleMessage, setBattleMessage] = useState("You have encountered an enemy!")

  // Player Stats
  const [player, updatePlayer] = useState({
    health: 10,
    strength: 6,
    agility: 7,
    perception: 7
  });

  // Enemy Stats
  const [enemyProto, updateEnemyProto] = useState({
    health: 4,
    strength: 4,
    agility: 10
  });

  ////////////////////////////////////////
  // This is where the magic happens... //
  ////////////////////////////////////////
  const doBattle = (attackType:AttackType, playerStats:any, enemyStats:any, updatePlayer:Function, updateEnemy:Function, setBattleMessage:Function) => {

    // At present - randomly decide the enemies attack - potential modifiers depending on the enemy is something to consider.
    let enemyAttack = Math.floor((Math.random() * 4)) + 1;
    
    // Damage values are a default of 2 - Fighting Fantasy style. These could be calculated based on statistics or alternatively accept modifiers, or both!
    let playerBaseDamageDealt = 2;
    let enemyBaseDamageDealt = 2;

    // Calculate Rolls for both Player and Enemy
    var playerStrengthRoll = playerStats.strength + (Math.floor((Math.random() * 6)) + 1); // Strength plus d6
    var playerAgilityRoll = playerStats.agility + (Math.floor((Math.random() * 6)) + 1); // Agility plus d6
    var enemyStrengthRoll = enemyStats.strength + (Math.floor((Math.random() * 4)) + 1); // Strength plus d4 - we give the player a bit of an upper hand
    var enemyAgilityRoll = enemyStats.agility + (Math.floor((Math.random() * 4)) + 1); // Agility plus d4 - we give the player a bit of an upper hand

    //////////////////////////////////////////////////
    // MY EYES! WHAT THE HELL HAVE I WRITTEN HERE!? //
    //////////////////////////////////////////////////

    switch(attackType){
      // Switch on the Players Selected Attack
      case AttackType.Deflect:
        {
          // Then Switch on the Enemies Attack
          switch(enemyAttack){
            case AttackType.Deflect:
              {
                // Deflect vs Deflect:
                // Nothing happens.
                setBattleMessage("(D vs D) You and the Enemy both prepare a defensive stance. A moment of respite from the dancing of blades...")
                break;
              }
            case AttackType.Parry:
              {
                // Deflect vs Parry:
                // Nothing happens.
                setBattleMessage("(D vs P) You and the Enemy both prepare a defensive stance. A moment of respite from the dancing of blades...")
                break;
              }
            case AttackType.HeavyStrike:
              {
                // Deflect vs Heavy Strike:
                // Deflect gains a bonus against Heavy Strike
                if((playerStrengthRoll + 1) // Player: Deflect is Strength based. Add bonus too.
                    >=
                    enemyStrengthRoll){ // Enemy: Heavy Strike is Strength based.
                      // Player has won the roll.
                      updateEnemy({
                        health: (enemyStats.health - playerBaseDamageDealt), // Enemy takes damage
                        strength: enemyStats.strength,
                        agility: enemyStats.agility,
                      });
                      setBattleMessage(`(D vs H)The enemy attacks with a Heavy Strike. You deflect the blow and counter the attack. Enemy takes ${playerBaseDamageDealt} damage.`)
                    }
                    else{
                      // Player has lost the roll.
                      updatePlayer({
                        health: (playerStats.health - (enemyBaseDamageDealt + 1)), // Risk factor of failing defence
                        strength: playerStats.strength,
                        agility: playerStats.agility,
                        perception: playerStats.perception,
                      });
                      setBattleMessage(`(D vs H) The enemy attacks with a Heavy Strike. You fail to deflect the blow and take ${enemyBaseDamageDealt + 1} damage.`)
                    }
                
                break;
              }
            case AttackType.FastStrike:
              {
                // Deflect vs Fast Strike:
                // Deflect has detriment against Fast Strike
                if((playerStrengthRoll - 1) // Player: Deflect is Strength based. Detriment though.
                    >=
                    enemyAgilityRoll){ // Enemy: Fast Strike is Agility based.
                      // Player has won the roll.
                      updateEnemy({
                        health: (enemyStats.health - playerBaseDamageDealt), // Enemy takes damage
                        strength: enemyStats.strength,
                        agility: enemyStats.agility,
                      });
                      setBattleMessage(`(D vs F)The enemy attacks with a Fast Strike. You deflect the blow and counter the attack. Enemy takes ${playerBaseDamageDealt} damage.`)
                    }
                    else{
                      // Player has lost the roll.
                      updatePlayer({
                        health: (playerStats.health - (enemyBaseDamageDealt + 1)), // Risk factor of failing defence
                        strength: playerStats.strength,
                        agility: playerStats.agility,
                        perception: playerStats.perception,
                      });
                      setBattleMessage(`(D vs F)The enemy attacks with a Fast Strike. You fail to deflect the blow and take ${enemyBaseDamageDealt + 1} damage.`)
                    }
                break;
              }
          }
          break;
        }
      case AttackType.Parry:
        {
          switch(enemyAttack){
            case AttackType.Deflect:
              {
                // Parry vs Deflect:
                // Nothing happens.
                setBattleMessage("(P vs D) You and the Enemy both prepare a defensive stance. A moment of respite from the dancing of blades...")
                break;
              }
            case AttackType.Parry:
              {
                // Parry vs Parry:
                // Nothing happens.
                setBattleMessage("(P vs P) You and the Enemy both prepare a defensive stance. A moment of respite from the dancing of blades...")
                break;
              }
            case AttackType.HeavyStrike:
              {
                // Parry vs Heavy Strike:
                // Parry has detriment against Heavy Strike
                if((playerAgilityRoll - 1) // Player: Parry is Agility based. Detriment also.
                    >=
                    enemyStrengthRoll){ // Enemy: Heavy Strike is Strength based.
                      // Player has won the roll.
                      updateEnemy({
                        health: (enemyStats.health - playerBaseDamageDealt), // Enemy takes damage
                        strength: enemyStats.strength,
                        agility: enemyStats.agility,
                      });
                      setBattleMessage(`(P vs H) The enemy attacks with a Heavy Strike. You parry the blow and counter the attack. Enemy takes ${playerBaseDamageDealt} damage.`)
                    }
                    else{
                      // Player has lost the roll.
                      updatePlayer({
                        health: (playerStats.health - (enemyBaseDamageDealt + 1)), // Risk factor of failing defence
                        strength: playerStats.strength,
                        agility: playerStats.agility,
                        perception: playerStats.perception,
                      });
                      setBattleMessage(`(P vs H) The enemy attacks with a Heavy Strike. You fail to parry the blow and take ${enemyBaseDamageDealt + 1} damage.`)
                    }
                break;
              }
            case AttackType.FastStrike:
              {
                // Parry vs Fast Strike:
                // Parry gains a bonus against Fast Strike
                if((playerAgilityRoll + 1) // Player: Parry is Agility based. Add bonus too.
                >=
                enemyAgilityRoll){ // Enemy: Fast Strike is Agility based.
                  // Player has won the roll.
                  updateEnemy({
                    health: (enemyStats.health - (playerBaseDamageDealt + 1)), // Enemy takes damage // Risk factor for failiing defence
                    strength: enemyStats.strength,
                    agility: enemyStats.agility,
                  });
                  setBattleMessage(`(P vs F) The enemy attacks with a Fast Strike. You parry the blow and counter the attack. Enemy takes ${playerBaseDamageDealt  + 1} damage.`)
                }
                else{
                  // Player has lost the roll.
                  updatePlayer({
                    health: (playerStats.health - enemyBaseDamageDealt), 
                    strength: playerStats.strength,
                    agility: playerStats.agility,
                    perception: playerStats.perception,
                  });
                  setBattleMessage(`(P vs F) The enemy attacks with a Fast Strike. You fail to parry the blow and take ${enemyBaseDamageDealt} damage.`)
                }
                break;
              }
          }
          break;
        }
      case AttackType.FastStrike:
        {
          switch(enemyAttack){
            case AttackType.Deflect:
              {
                // Fast Strike vs Deflect:
                if((playerAgilityRoll) // Player: Fast Strike is Agility based.
                >=
                enemyStrengthRoll - 1){ // Enemy: Deflect is Strength based. Detriment also.
                  // Player has won the roll...
                  updateEnemy({
                    health: (enemyStats.health - (playerBaseDamageDealt + 1)), // Enemy takes damage // Risk factor for failiing defence
                    strength: enemyStats.strength,
                    agility: enemyStats.agility,
                  });
                  setBattleMessage(`(F vs D) The enemy attempts to Deflect but your attack strikes true. Enemy takes ${playerBaseDamageDealt  + 1} damage.`);
                }
                else{
                  // Player has lost the roll.
                  updatePlayer({
                    health: (playerStats.health - (enemyBaseDamageDealt)), 
                    strength: playerStats.strength,
                    agility: playerStats.agility,
                    perception: playerStats.perception,
                  });
                  setBattleMessage(`(F vs D) The enemy Deflects your attack and counters. You take ${enemyBaseDamageDealt + 1} damage.`)
                }
                break;
              }
            case AttackType.Parry:
              {
                // Fast Strike vs Parry:
                if((playerAgilityRoll) // Player: Fast Strike is Agility based.
                >=
                enemyAgilityRoll + 1){ // Enemy: Deflect is Strength based. Detriment also.
                  // Player has won the roll...
                  updateEnemy({
                    health: (enemyStats.health - (playerBaseDamageDealt + 1)), // Enemy takes damage // Risk factor for failiing defence
                    strength: enemyStats.strength,
                    agility: enemyStats.agility,
                  });
                  setBattleMessage(`(F vs P) The enemy attempts to Parry but your attack strikes true. Enemy takes ${playerBaseDamageDealt + 1} damage.`);
                }
                else{
                  // Player has lost the roll.
                  updatePlayer({
                    health: (playerStats.health - enemyBaseDamageDealt), 
                    strength: playerStats.strength,
                    agility: playerStats.agility,
                    perception: playerStats.perception,
                  });
                  setBattleMessage(`(F vs P) The enemy Parries your attack and counters. You take ${enemyBaseDamageDealt} damage.`)
                }
                break;
              }
            case AttackType.HeavyStrike:
              {
                // Fast Strike vs Heavy Strike:
                if((playerAgilityRoll) // Player: Fast Strike is Agility based.
                >=
                enemyStrengthRoll){ // Enemy: Heavy Strike is Strength based.
                  // Player wins the roll...
                  updateEnemy({
                    health: (enemyStats.health - playerBaseDamageDealt), // Enemy takes damage
                    strength: enemyStats.strength,
                    agility: enemyStats.agility,
                  });
                  setBattleMessage(`(F vs H) Blades clash but you overcome your enemy. Enemy takes ${playerBaseDamageDealt} damage.`);
                }
                else{
                  // PLayer has lost the roll...
                  updatePlayer({
                    health: (playerStats.health - enemyBaseDamageDealt),
                    strength: playerStats.strength,
                    agility: playerStats.agility,
                    perception: playerStats.perception,
                  });
                  setBattleMessage(`(F vs H) The enemies attack strikes you first. You take ${enemyBaseDamageDealt} damage.`)
                }
                break;
              }
            case AttackType.FastStrike:
              {
                // Fast Strike vs Fast Strike:
                if((playerAgilityRoll) // Player: Fast Strike is Agility based.
                >=
                enemyAgilityRoll){ // Enemy: Heavy Strike is Strength based.
                  // Player wins the roll...
                  updateEnemy({
                    health: (enemyStats.health - playerBaseDamageDealt), // Enemy takes damage
                    strength: enemyStats.strength,
                    agility: enemyStats.agility,
                  });
                  setBattleMessage(`(F vs F) Blades clash but you overcome your enemy. Enemy takes ${playerBaseDamageDealt} damage.`);
                }
                else{
                  // PLayer has lost the roll...
                  updatePlayer({
                    health: (playerStats.health - enemyBaseDamageDealt), 
                    strength: playerStats.strength,
                    agility: playerStats.agility,
                    perception: playerStats.perception,
                  });
                  setBattleMessage(`(F vs F) The enemies attack strikes you first. You take ${enemyBaseDamageDealt} damage.`)
                }
                break;
              }
          }
          break;
        }
      case AttackType.HeavyStrike:
        {
          switch(enemyAttack){
            case AttackType.Deflect:
              {
                // Heavy Strike vs Deflect:
                if((playerStrengthRoll) // Player: Heavy Strike is strength based.
                >=
                enemyStrengthRoll + 1){ // Enemy: Deflect is Strength based. Bonus also.
                  // Player has won the roll...
                  updateEnemy({
                    health: (enemyStats.health - (playerBaseDamageDealt + 1)), // Enemy takes damage // Risk factor for failiing defence
                    strength: enemyStats.strength,
                    agility: enemyStats.agility,
                  });
                  setBattleMessage(`(H vs D) The enemy attempts to Deflect but your attack strikes true. Enemy takes ${playerBaseDamageDealt  + 1} damage.`);
                }
                else{
                  // Player has lost the roll.
                  updatePlayer({
                    health: (playerStats.health - enemyBaseDamageDealt), 
                    strength: playerStats.strength,
                    agility: playerStats.agility,
                    perception: playerStats.perception,
                  });
                  setBattleMessage(`(H vs D) The enemy Deflect your attack and counters. You take ${enemyBaseDamageDealt} damage.`)
                }
                break;
              }
            case AttackType.Parry:
              {
                // Heavy Strike vs Parry:
                if((playerStrengthRoll) // Player: Heavy Strike is strength based.
                >=
                enemyAgilityRoll - 1){ // Enemy: Parry is Agility based. Detriment also.
                  // Player has won the roll...
                  updateEnemy({
                    health: (enemyStats.health - (playerBaseDamageDealt + 1)), // Enemy takes damage // Risk factor for failiing defence
                    strength: enemyStats.strength,
                    agility: enemyStats.agility,
                  });
                  setBattleMessage(`(H vs P) The enemy attempts to Parry but your attack strikes true. Enemy takes ${playerBaseDamageDealt + 1} damage.`);
                }
                else{
                  // Player has lost the roll.
                  updatePlayer({
                    health: (playerStats.health - enemyBaseDamageDealt),
                    strength: playerStats.strength,
                    agility: playerStats.agility,
                    perception: playerStats.perception,
                  });
                  setBattleMessage(`(H vs P) The enemy Parries your attack and counters. You take ${enemyBaseDamageDealt} damage.`)
                }
                break;
              }
            case AttackType.HeavyStrike:
              {
                // Heavy Strike vs Heavy Strike:
                if((playerStrengthRoll) // Player: Heavy Strike is Strength based.
                >=
                enemyStrengthRoll){ // Enemy: Heavy Strike is Strength based.
                  // Player wins the roll...
                  updateEnemy({
                    health: (enemyStats.health - playerBaseDamageDealt), // Enemy takes damage
                    strength: enemyStats.strength,
                    agility: enemyStats.agility,
                  });
                  setBattleMessage(`(H vs H) Blades clash but you overcome your enemy. Enemy takes ${playerBaseDamageDealt} damage.`);
                }
                else{
                  // Player has lost the roll...
                  updatePlayer({
                    health: (playerStats.health - enemyBaseDamageDealt), 
                    strength: playerStats.strength,
                    agility: playerStats.agility,
                    perception: playerStats.perception,
                  });
                  setBattleMessage(`(H vs H) The enemies attack strikes you first. You take ${enemyBaseDamageDealt} damage.`)
                }


                break;
              }
            case AttackType.FastStrike:
              {
                // Heavy Strike vs Fast Strike:
                if((playerStrengthRoll) // Player: Heavy Strike is Strength based.
                >=
                enemyAgilityRoll){ // Enemy: Fast Strike is Agility based.
                  // Player wins the roll...
                  updateEnemy({
                    health: (enemyStats.health - playerBaseDamageDealt), // Enemy takes damage
                    strength: enemyStats.strength,
                    agility: enemyStats.agility,
                  });
                  setBattleMessage(`(H vs F) Blades clash but you overcome your enemy. Enemy takes ${playerBaseDamageDealt} damage.`);
                }
                else{
                  // Player has lost the roll...
                  updatePlayer({
                    health: (playerStats.health - enemyBaseDamageDealt), 
                    strength: playerStats.strength,
                    agility: playerStats.agility,
                    perception: playerStats.perception,
                  });
                  setBattleMessage(`(H vs F) The enemies attack strikes you first. You take ${enemyBaseDamageDealt} damage.`)
                }

                break;
              }
          }
          break;
        }
    }




  } 


  return (
    <div className="App">
      <header className="App-header">
        <h4>Combat Prototype</h4>
        <EnemyHealthBar
        health={enemyProto.health}
        strength={enemyProto.strength}
        agility={enemyProto.agility}
        playerPerception={player.perception}
      />
      <p>======================================</p>
      <p>{battleMessage}</p>
      <p>======================================</p>
        <div style={{border: '3px grey ridge', padding: '5px'}}>
        <PlayerBar
        health={player.health}
        strength={player.strength}
        agility={player.agility}
        perception={player.perception}
        />   
        <button onClick={() => doBattle(AttackType.FastStrike, player, enemyProto, updatePlayer, updateEnemyProto, setBattleMessage)}>Fast Strike</button>
        <button onClick={() => doBattle(AttackType.HeavyStrike, player, enemyProto, updatePlayer, updateEnemyProto, setBattleMessage)}>Heavy Strike</button>
        <button onClick={() => doBattle(AttackType.Parry, player, enemyProto, updatePlayer, updateEnemyProto, setBattleMessage)}>Parry</button>
        <button onClick={() => doBattle(AttackType.Deflect, player, enemyProto, updatePlayer, updateEnemyProto, setBattleMessage)}>Deflect</button>
        </div>
      </header>
    </div>
  );
}

export default App;
