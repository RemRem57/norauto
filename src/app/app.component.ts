import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import p5 from 'p5';
import {NgIf} from "@angular/common";
import { interval, Subscription } from 'rxjs';
import {FormsModule} from "@angular/forms";
export type bound = {
  x: number,
  y: number,
  width: number,
  height: number
}

export const next_button_bound: bound = {
  x: 889,
  y: 667,
  width: 162,
  height: 38
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Norauto';
  protected scoreSatClient: number = 50;
  protected jauge: Boolean = false;
  private timerSubscription: Subscription = new Subscription();
  public elapsedTimeInSeconds: number = 0;
  public isTimerRunning: boolean = false;
  protected plaqueImm: String = "";
  protected isVisiblePlaque: Boolean = false;
  protected wantedPLaque: String = "ar-567-tu";
  protected isVisibleChoiceDailogue: Boolean = false;
  protected isVisibleChoiceDailogueEnd: Boolean = false;
  protected isVisibleBonjour: Boolean = false;
  public sketchGlobal: p5 | undefined;
  ngOnInit(): void {
    // Initialisation du timer
  this.resetTimer();
    // Create a new p5 instance
    const sketch = (s: p5) => {
      this.sketchGlobal = s;
      s.setup = () => {
        s.createCanvas(1080, 720);
        s.background(0);

        this.page1(s);
      };

      s.draw = () => {
        // Do nothing
      };
    }

    new p5(sketch);
  }
  // Fonction pour mettre à jour le score (appelée par exemple lors d'un événement)
  updateScore(newScore: number): void {
    // Assurez-vous que le score reste dans la plage de 0 à 100
    this.scoreSatClient = Math.min(100, Math.max(0, newScore));
  }

  startTimer(): void {
    // Démarrer le timer seulement si ce n'est pas déjà en cours
    if (!this.isTimerRunning) {
      this.timerSubscription = interval(1000).subscribe(() => {
        this.elapsedTimeInSeconds++;
        this.updateScore(this.scoreSatClient - 0.01);
      });
      this.isTimerRunning = true;
    }
  }

  stopTimer(): void {
    // Arrêter le timer seulement s'il est en cours
    if (this.isTimerRunning) {
      this.timerSubscription.unsubscribe();
      this.isTimerRunning = false;
    }
  }

  resetTimer(): void {
    // Réinitialiser le timer
    this.elapsedTimeInSeconds = 0;
    this.stopTimer();
  }

  ngOnDestroy(): void {
    // S'assurer que le timer est arrêté lors de la destruction du composant
    this.stopTimer();
  }

  /**
   * Menu prinicpal (Bouton jouer)
   * @param sketch
   */
  page1(sketch: p5) {
    sketch.clear();
    this.jauge = false;

    sketch.loadImage('assets/Frame 1.png', img => {
      sketch.image(img, 0, 0);
    });

      // Bouton jouer
    sketch.mouseClicked = () => {
      if (sketch.mouseX > 409 && sketch.mouseX < 671 && sketch.mouseY > 579 && sketch.mouseY < 639) {
        this.page2(sketch);
      }
    }
  }

  /**
   * Explication du jouer (bouton suivant + quitter)
   * @param sketch
   */
  page2(sketch: p5) {
    this.resetTimer();
    this.startTimer();
    sketch.clear();
    this.jauge = true;

    sketch.loadImage('assets/Frame 2.png', img => {
      sketch.image(img, 0, 0);
    });

    sketch.mouseClicked = () => {
      // Bouton suivant
      if (this.isButtonPress(next_button_bound, sketch)) {
        this.page3(sketch);
      }

      // Bouton quitter
      if (sketch.mouseX > 721 && sketch.mouseX < 875 && sketch.mouseY > 667 && sketch.mouseY < 705) {
        this.page5(sketch);
      }
    }

  }

  /**
   * Première interaction avec un client
   * Choix de la posture
   * @param sketch
   */
  page3(sketch: p5) {
    this.resetTimer();
    this.startTimer();
    sketch.clear();

    sketch.loadImage('assets/Frame_3.png', img => {
      sketch.image(img, 0, 0);

    });


    sketch.mouseClicked = () => {
      const boundButton1 : bound = {x :272, y : 225, width : 152, height : 135 };
      const boundButton2 : bound = {x :468, y : 225, width : 152, height : 135 };
      const boundButton3 : bound = {x :663, y : 225, width : 152, height : 135 };
      const boundButton4 : bound = {x :368, y : 433, width : 152, height : 135 };
      const boundButton5 : bound = {x :562, y : 433, width : 152, height : 135 };

      if (this.isButtonPress(boundButton1, sketch)) {
        this.updateScore(this.scoreSatClient - 10);
      }
      if (this.isButtonPress(boundButton2, sketch)) {
        this.updateScore(this.scoreSatClient - 5);
      }

      if (this.isButtonPress(boundButton3, sketch)) {
        this.updateScore(this.scoreSatClient - 15);
      }

      if (this.isButtonPress(boundButton4, sketch)) {
        this.updateScore(this.scoreSatClient + 10);
      }

      if (this.isButtonPress(boundButton5, sketch)) {
        this.updateScore(this.scoreSatClient - 5);
      }

      this.page4(sketch);
    }

  }

  // manage 3 choice dialogue
  page4(sketch: p5) {
    this.resetTimer();
    this.startTimer();
    sketch.clear();

    sketch.loadImage('assets/Frame 12 (1).png', img => {
      sketch.image(img, 0, 0);
    });

    this.isVisibleChoiceDailogue=true;
    this.isVisibleBonjour=true;

  }

  selectOption(option: string): void {
    switch (option) {
      case 'Bonjour':
        this.updateScore(this.scoreSatClient + 30);
        break;
      case 'Disponible':
        this.updateScore(this.scoreSatClient + 15);
        break;
      case 'NePasRepondre':
        this.updateScore(this.scoreSatClient - 5);
        break;
    }

    this.isVisibleChoiceDailogue=false;
    this.isVisibleBonjour=false;
    this.page5(this.sketchGlobal);
  }

  page5(sketch?: p5) {
    this.resetTimer();
    this.startTimer();
    if (!sketch) return;  // BABPTISTE GROS NUL
    sketch.clear();

    const debutDeScene = () => {
      sketch.clear();

      sketch.loadImage('assets/plaque_imat/Frame 5.png', img => {
        sketch.image(img, 0, 0);
      });

      sketch.mouseClicked = () => {
        if (this.isButtonPress(next_button_bound, sketch)) {
          debutDeScene2();
        }
      }
    }

    const debutDeScene2 = () => {
      sketch.clear();

      sketch.loadImage('assets/plaque_imat/Frame 6.png', img => {
        sketch.image(img, 0, 0);
      });

      sketch.mouseClicked = () => {
        if (this.isButtonPress(next_button_bound, sketch)) {
           sceneMontrePlaque()
        }
      }
    }

    const sceneMontrePlaque = () => {
      sketch.clear();

      sketch.loadImage('assets/plaque_imat/Frame 7.png', img => {
        sketch.image(img, 0, 0);

        sketch.loadImage('assets/plaque_imat/image 5.png', plat_img => {
          sketch.loadImage('assets/Keys_assets/key_6.png', key_img => {
            setTimeout(() => {
              sketch.image(plat_img, 150, 400);
              sketch.image(key_img, 100, 300, 100, 150);

              setTimeout(() => {
                sketch.clear();
                sketch.image(img, 0, 0);

                sceneSaisirPlaque();
              }, 5000);
            }, 2000);
          });
        });
      });
    }


    const sceneSaisirPlaque = () => {
      this.resetTimer();
      this.startTimer();
      sketch.clear();

      sketch.loadImage('assets/plaque_imat/Frame 9.png', img => {
        sketch.image(img, 0, 0);

        const platImat = "FA-235-FB";
        const input = sketch.createInput("AA-123-BB");
        input.position(400, 500);

        sketch.mouseClicked = () => {
          if (this.isButtonPress(next_button_bound, sketch)) {
            const value = input.value();
            input.remove();
            if (value === platImat) {
              this.updateScore(this.scoreSatClient + 5);
              this.page6(sketch);
            } else {
              this.updateScore(this.scoreSatClient - 5);
              alert("Mauvaise plaque, recommencer");
              sceneMontrePlaque();
            }
          }
        }
      });
    }

    debutDeScene();
  }

  // manage 3 choice dialogue
  page7(sketch: p5) {
    this.resetTimer();
    this.startTimer();
    sketch.clear();

    sketch.loadImage('assets/Frame 12 (1).png', img => {
      sketch.image(img, 0, 0);
    });

    this.isVisibleChoiceDailogueEnd=true;

  }

  selectOptionEnd(option: string): void {
   /* a. Donner les clés au client
    b. Demander à un technicien de ramener la voiture
    devant le garage
    c. Racompagner le client jusqu'à la porte*/
    switch (option) {
      case 'Bonjour':
        this.updateScore(this.scoreSatClient - 5);
        break;
      case 'Disponible':
        this.updateScore(this.scoreSatClient + 30);
        break;
      case 'NePasRepondre':
        this.updateScore(this.scoreSatClient + 15);
        break;
    }

    this.isVisibleChoiceDailogueEnd=false;
    if(this.scoreSatClient >= 70) {
      this.pageBonneFin(this.sketchGlobal);
    } else {
      this.pageMauvaiseFin(this.sketchGlobal);
    }

  }

  page6(sketch: p5) {
    this.resetTimer();
    this.startTimer();
    sketch.clear();

    sketch.loadImage('assets/Frame_8.png', img => {
      sketch.image(img, 0, 0);
    });

    sketch.mouseClicked = () => {
      if(sketch.mouseX > 71 && sketch.mouseX < 232 && sketch.mouseY > 93 && sketch.mouseY < 252){
        this.updateScore(this.scoreSatClient - 2);
      }

      if(sketch.mouseX > 240 && sketch.mouseX < 401 && sketch.mouseY > 93 && sketch.mouseY < 252){
        this.updateScore(this.scoreSatClient - 2);
      }

      if(sketch.mouseX > 409 && sketch.mouseX < 570 && sketch.mouseY > 93 && sketch.mouseY < 252){
        this.updateScore(this.scoreSatClient + 5);
        this.page7(sketch);
      }

      if(sketch.mouseX > 578 && sketch.mouseX < 739 && sketch.mouseY > 93 && sketch.mouseY < 252) {
        this.updateScore(this.scoreSatClient - 2);
      }

      if(sketch.mouseX > 71 && sketch.mouseX < 232 && sketch.mouseY > 400 && sketch.mouseY < 559){
        this.updateScore(this.scoreSatClient - 2);
      }

      if(sketch.mouseX > 240 && sketch.mouseX < 401 && sketch.mouseY > 400 && sketch.mouseY < 559){
        this.updateScore(this.scoreSatClient - 2);
      }

      if(sketch.mouseX > 409 && sketch.mouseX < 570 && sketch.mouseY > 400 && sketch.mouseY < 559){
        this.updateScore(this.scoreSatClient - 2);
      }

      if(sketch.mouseX > 578 && sketch.mouseX < 739 && sketch.mouseY > 400 && sketch.mouseY < 559){
        this.updateScore(this.scoreSatClient - 2);
      }
    }

  }


  pageBonneFin(sketch?: p5) {
    if(!sketch) return;
    sketch.clear();

    sketch.loadImage('assets/Frame_10.png', img => {
      sketch.image(img, 0, 0);
    });

    sketch.mouseClicked = () => {
      if (sketch.mouseX > 409 && sketch.mouseX < 671 && sketch.mouseY > 579 && sketch.mouseY < 639) {
        this.page2(sketch);
      }
    }

  }

  pageMauvaiseFin(sketch?: p5) {
    if(!sketch) return;
    sketch.clear();

    sketch.loadImage('assets/Frame_11.png', img => {
      sketch.image(img, 0, 0);
    });

    sketch.mouseClicked = () => {
      if (sketch.mouseX > 409 && sketch.mouseX < 671 && sketch.mouseY > 579 && sketch.mouseY < 639) {
        this.page2(sketch);
      }
    }

  }


  // Utils functions
  isButtonPress(button: bound, sketch: p5): boolean {
    return sketch.mouseX > button.x && sketch.mouseX < button.x + button.width && sketch.mouseY > button.y && sketch.mouseY < button.y + button.height;
  }

  protected readonly Math = Math;
}
