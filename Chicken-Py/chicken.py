import pygame
import random
import sys
import os


WINDOW_WIDTH = 640
WINDOW_HEIGHT = 800
FPS = 60

LANE_COUNT = 7                 # number of lanes of traffic (rows with moving obstacles)
LANE_HEIGHT = 60               # height of each lane in pixels
ROAD_TOP_MARGIN = 140          # top y where lanes begin (above: safe zone)
SAFE_ZONE_HEIGHT = 120         # height of bottom and top safe areas

CHICKEN_SIZE = 36              # size of the player square
CHICKEN_SPEED = 6              # movement speed in pixels per frame

CAR_BASE_SPEED = 3.0           # base speed for cars
CAR_SPEED_INCREMENT = 0.25     # how much speed increases every difficulty step
CAR_SPAWN_BASE_RATE = 90       # lower is more frequent (frames between spawns)
CAR_SPAWN_DECREMENT = 5        # how much spawn rate decreases (spawns more) per difficulty step
MIN_SPAWN_RATE = 18            # cap for spawn frequency

INITIAL_LIVES = 3

HIGH_SCORE_FILE = "chicken_highscore.txt"

# Colors
WHITE = (250, 250, 250)
BLACK = (20, 20, 20)
ROAD_GRAY = (40, 40, 40)
GRASS_GREEN = (80, 180, 60)
YELLOW = (245, 200, 50)
RED = (220, 60, 60)
BLUE = (60, 140, 220)
ORANGE = (255, 140, 30)
LIGHT_GRAY = (200, 200, 200)

# Initialize pygame
pygame.init()
pygame.display.set_caption("Chicken Road")
screen = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT))
clock = pygame.time.Clock()
font = pygame.font.SysFont("dejavusans", 20)
big_font = pygame.font.SysFont("dejavusans", 46)
med_font = pygame.font.SysFont("dejavusans", 30)

def load_high_score():
    try:
        if os.path.exists(HIGH_SCORE_FILE):
            with open(HIGH_SCORE_FILE, "r") as f:
                return int(f.read().strip() or 0)
    except Exception:
        pass
    return 0


def save_high_score(score):
    try:
        with open(HIGH_SCORE_FILE, "w") as f:
            f.write(str(int(score)))
    except Exception:
        pass


def draw_text(surface, text, pos, color=WHITE, font_obj=None, center=False):
    if font_obj is None:
        font_obj = font
    text_surf = font_obj.render(text, True, color)
    text_rect = text_surf.get_rect()
    if center:
        text_rect.center = pos
    else:
        text_rect.topleft = pos
    surface.blit(text_surf, text_rect)


class Car:
    def __init__(self, x, y, width, height, speed, direction, color):
        self.rect = pygame.Rect(x, y, width, height)
        self.speed = speed
        self.direction = direction
        self.color = color

    def update(self, dt):
        self.rect.x += int(self.speed * self.direction * dt)

    def draw(self, surface):
        pygame.draw.rect(surface, self.color, self.rect)
        window_h = self.rect.h // 3
        if window_h > 0:
            pygame.draw.rect(surface, LIGHT_GRAY, (self.rect.x + 4, self.rect.y + 4, self.rect.w - 8, window_h))


class Lane:
    def __init__(self, idx, top_y, direction, base_speed, spawn_rate_frames, color):
        self.idx = idx
        self.top_y = top_y
        self.direction = direction
        self.base_speed = base_speed
        self.spawn_rate_frames = spawn_rate_frames
        self.color = color
        self.cars = []
        self.spawn_timer = 0

    def update(self, dt, spawn_rate_modifier=0):
        for car in self.cars:
            car.update(dt)

        if self.direction == 1:
            self.cars = [c for c in self.cars if c.rect.x < WINDOW_WIDTH + 200]
        else:
            self.cars = [c for c in self.cars if c.rect.x > -200]

        # spawning new cars
        effective_spawn_rate = max(MIN_SPAWN_RATE, self.spawn_rate_frames - spawn_rate_modifier)
        self.spawn_timer += 1
        if self.spawn_timer >= effective_spawn_rate:
            self.spawn_car()
            self.spawn_timer = 0

    def spawn_car(self):
        lane_padding = 8
        car_height = LANE_HEIGHT - lane_padding
        car_width = random.randint(60, 130)
        # y coordinate centers car vertically in lane
        y = self.top_y + (LANE_HEIGHT - car_height) // 2
        speed_variation = random.uniform(0.8, 1.35)
        speed = self.base_speed * speed_variation

        if self.direction == 1:
            x = -car_width - random.randint(10, 200)
        else:
            x = WINDOW_WIDTH + random.randint(10, 200)

        color = random.choice([RED, ORANGE, BLUE, YELLOW])
        car = Car(x, y, car_width, car_height, speed, self.direction, color)
        self.cars.append(car)

    def draw(self, surface):
        for car in self.cars:
            car.draw(surface)


class Chicken:
    def __init__(self, x, y):
        self.rect = pygame.Rect(x, y, CHICKEN_SIZE, CHICKEN_SIZE)
        self.color = (255, 255, 180)
        self.alive = True
        self.spawn_x = x
        self.spawn_y = y

    def move(self, dx, dy):
        self.rect.x += dx
        self.rect.y += dy
        if self.rect.left < 0:
            self.rect.left = 0
        if self.rect.right > WINDOW_WIDTH:
            self.rect.right = WINDOW_WIDTH
        if self.rect.top < 0:
            self.rect.top = 0
        if self.rect.bottom > WINDOW_HEIGHT:
            self.rect.bottom = WINDOW_HEIGHT

    def draw(self, surface):
        # Draw a stylized chicken: body + small "beak" and eye
        pygame.draw.ellipse(surface, self.color, self.rect)
        # eye
        eye_w = max(3, CHICKEN_SIZE // 8)
        eye_h = eye_w
        pygame.draw.circle(surface, BLACK, (self.rect.centerx + 6, self.rect.y + 10), eye_w)
        # beak
        beak_points = [
            (self.rect.right - 4, self.rect.centery),
            (self.rect.right + 10, self.rect.centery - 6),
            (self.rect.right + 10, self.rect.centery + 6),
        ]
        pygame.draw.polygon(surface, ORANGE, beak_points)

    def reset_position(self):
        self.rect.x = self.spawn_x
        self.rect.y = self.spawn_y


class Game:
    def __init__(self):
        self.running = True
        self.playing = False  
        self.paused = False

        self.score = 0
        self.lives = INITIAL_LIVES
        self.high_score = load_high_score()

        # Set up chicken spawn bottom in safe zone
        spawn_x = (WINDOW_WIDTH - CHICKEN_SIZE) // 2
        spawn_y = WINDOW_HEIGHT - SAFE_ZONE_HEIGHT + (SAFE_ZONE_HEIGHT - CHICKEN_SIZE) // 2
        self.chicken = Chicken(spawn_x, spawn_y)

        # Build lanes
        self.lanes = []
        self._setup_lanes()

        # Difficulty modifiers
        self.difficulty_step = 0  # increases as player scores to increase speed/spawn frequency
        self.frames_since_start = 0

        self.move_left = False
        self.move_right = False
        self.move_up = False
        self.move_down = False

        self.start_message_shown = True
        self.game_over = False

    def _setup_lanes(self):
        self.lanes.clear()
        top = ROAD_TOP_MARGIN
        for i in range(LANE_COUNT):
            lane_y = top + i * LANE_HEIGHT
            direction = 1 if (i % 2 == 0) else -1
            color = ROAD_GRAY
            # speed increases a bit for lower lanes to add variety
            base_speed = CAR_BASE_SPEED + (i * 0.22)
            spawn_rate = CAR_SPAWN_BASE_RATE - (i * 6)
            lane = Lane(i, lane_y, direction, base_speed, spawn_rate, color)
            self.lanes.append(lane)

    def reset_round(self):
        self.chicken.reset_position()
        self.chicken.alive = True
        # clear cars
        for lane in self.lanes:
            lane.cars.clear()
            lane.spawn_timer = 0
        self.paused = False
        self.frames_since_start = 0
        self.game_over = False

    def start_game(self):
        self.score = 0
        self.lives = INITIAL_LIVES
        self.difficulty_step = 0
        self.reset_round()
        self.playing = True
        self.start_message_shown = False

    def trigger_game_over(self):
        self.game_over = True
        self.playing = False
        if self.score > self.high_score:
            self.high_score = self.score
            save_high_score(self.high_score)

    def update(self):
        if not self.playing or self.paused:
            return

        self.frames_since_start += 1

        # directional moves
        dx = 0
        dy = 0
        if self.move_left:
            dx -= CHICKEN_SPEED
        if self.move_right:
            dx += CHICKEN_SPEED
        if self.move_up:
            dy -= CHICKEN_SPEED
        if self.move_down:
            dy += CHICKEN_SPEED
        if dx != 0 or dy != 0:
            self.chicken.move(dx, dy)

        spawn_modifier = int(self.difficulty_step * 4 + self.score * 0.6)

        # Update lanes
        for lane in self.lanes:
            lane.update(dt=1, spawn_rate_modifier=spawn_modifier)

        # Collision detection
        chicken_rect = self.chicken.rect
        collided = False
        for lane in self.lanes:
            lane_rect = pygame.Rect(0, lane.top_y, WINDOW_WIDTH, LANE_HEIGHT)
            if chicken_rect.colliderect(lane_rect):
                for car in lane.cars:
                    if chicken_rect.colliderect(car.rect):
                        collided = True
                        break
            if collided:
                break

        if collided:
            self.lives -= 1
            if self.lives <= 0:
                self.trigger_game_over()
            else:
                self.chicken.reset_position()

        if self.chicken.rect.top <= SAFE_ZONE_HEIGHT - 10:
            self.score += 1
            if (self.score % 4) == 0:
                self.difficulty_step += 1
                for index, lane in enumerate(self.lanes):
                    lane.base_speed += CAR_SPEED_INCREMENT
                    lane.spawn_rate_frames = max(MIN_SPAWN_RATE, lane.spawn_rate_frames - 3)
            self.chicken.reset_position()

    def draw_background(self):
        # grass safe zones (top and bottom)
        screen.fill(GRASS_GREEN)
        # top safe zone
        pygame.draw.rect(screen, GRASS_GREEN, (0, 0, WINDOW_WIDTH, SAFE_ZONE_HEIGHT))
        # bottom safe zone
        pygame.draw.rect(screen, GRASS_GREEN, (0, WINDOW_HEIGHT - SAFE_ZONE_HEIGHT, WINDOW_WIDTH, SAFE_ZONE_HEIGHT))

        # road area (lanes)
        road_y = ROAD_TOP_MARGIN - 10
        road_height = LANE_COUNT * LANE_HEIGHT + 20
        pygame.draw.rect(screen, ROAD_GRAY, (0, road_y, WINDOW_WIDTH, road_height))

        # lane separators
        for i in range(LANE_COUNT + 1):
            y = ROAD_TOP_MARGIN + i * LANE_HEIGHT
            pygame.draw.line(screen, (50, 50, 50), (0, y), (WINDOW_WIDTH, y), 2)
        for i in range(LANE_COUNT):
            y = ROAD_TOP_MARGIN + i * LANE_HEIGHT + LANE_HEIGHT // 2
            dash_w = 30
            gap = 20
            x = 0
            while x < WINDOW_WIDTH:
                pygame.draw.line(screen, YELLOW, (x, y), (min(WINDOW_WIDTH, x + dash_w), y), 4)
                x += dash_w + gap

    def draw_hud(self):
        # score, lives, high score, difficulty
        draw_text(screen, f"Score: {self.score}", (12, 8))
        draw_text(screen, f"Lives: {self.lives}", (12, 34))
        draw_text(screen, f"High: {self.high_score}", (WINDOW_WIDTH - 120, 8))
        draw_text(screen, f"Difficulty: {self.difficulty_step}", (WINDOW_WIDTH - 170, 34))
        draw_text(screen, "Arrows/WASD to move — SPACE to start/restart — P to pause — R to restart", (12, WINDOW_HEIGHT - 28), color=BLACK, font_obj=font)

    def draw(self):
        self.draw_background()

        for lane in self.lanes:
            lane.draw(screen)

        self.chicken.draw(screen)

        self.draw_hud()

        if self.start_message_shown:
            overlay = pygame.Surface((WINDOW_WIDTH - 120, WINDOW_HEIGHT - 220))
            overlay.set_alpha(230)
            overlay.fill(BLACK)
            overlay_rect = overlay.get_rect(center=(WINDOW_WIDTH // 2, WINDOW_HEIGHT // 2))
            screen.blit(overlay, overlay_rect)
            draw_text(screen, "CHICKEN ROAD", (overlay_rect.centerx, overlay_rect.top + 20), color=YELLOW, font_obj=big_font, center=True)
            draw_text(screen, "Help the chicken cross the road!", (overlay_rect.centerx, overlay_rect.top + 80), color=WHITE, font_obj=med_font, center=True)
            draw_text(screen, "Controls: Arrow keys or WASD to move. Press SPACE to start.", (overlay_rect.centerx, overlay_rect.top + 140), color=WHITE, center=True)
            draw_text(screen, "Avoid cars. Score a point each successful crossing. Lose all lives = Game Over.", (overlay_rect.centerx, overlay_rect.top + 180), color=WHITE, center=True)
            draw_text(screen, "Press SPACE to start", (overlay_rect.centerx, overlay_rect.bottom - 40), color=YELLOW, font_obj=med_font, center=True)

        if self.paused and self.playing:
            overlay = pygame.Surface((WINDOW_WIDTH, WINDOW_HEIGHT))
            overlay.set_alpha(160)
            overlay.fill((40, 40, 40))
            screen.blit(overlay, (0, 0))
            draw_text(screen, "PAUSED", (WINDOW_WIDTH // 2, WINDOW_HEIGHT // 2 - 20), color=YELLOW, font_obj=big_font, center=True)
            draw_text(screen, "Press P to unpause", (WINDOW_WIDTH // 2, WINDOW_HEIGHT // 2 + 40), color=WHITE, center=True)

        if self.game_over:
            overlay = pygame.Surface((WINDOW_WIDTH - 120, WINDOW_HEIGHT - 220))
            overlay.set_alpha(230)
            overlay.fill(BLACK)
            overlay_rect = overlay.get_rect(center=(WINDOW_WIDTH // 2, WINDOW_HEIGHT // 2))
            screen.blit(overlay, overlay_rect)
            draw_text(screen, "GAME OVER", (overlay_rect.centerx, overlay_rect.top + 20), color=RED, font_obj=big_font, center=True)
            draw_text(screen, f"Your Score: {self.score}", (overlay_rect.centerx, overlay_rect.top + 86), color=WHITE, font_obj=med_font, center=True)
            draw_text(screen, f"High Score: {self.high_score}", (overlay_rect.centerx, overlay_rect.top + 120), color=WHITE, font_obj=font, center=True)
            draw_text(screen, "Press SPACE to restart a new game", (overlay_rect.centerx, overlay_rect.bottom - 60), color=YELLOW, font_obj=med_font, center=True)
            draw_text(screen, "Press ESC to quit", (overlay_rect.centerx, overlay_rect.bottom - 34), color=WHITE, center=True)

    def handle_keydown(self, key):
        if key in (pygame.K_LEFT, pygame.K_a):
            self.move_left = True
        if key in (pygame.K_RIGHT, pygame.K_d):
            self.move_right = True
        if key in (pygame.K_UP, pygame.K_w):
            self.move_up = True
        if key in (pygame.K_DOWN, pygame.K_s):
            self.move_down = True
        if key == pygame.K_SPACE:
            if not self.playing:
                # start a new game 
                self.start_game()
        if key == pygame.K_p:
            if self.playing:
                self.paused = not self.paused
        if key == pygame.K_r:
            # restart game
            self.start_game()

    def handle_keyup(self, key):
        if key in (pygame.K_LEFT, pygame.K_a):
            self.move_left = False
        if key in (pygame.K_RIGHT, pygame.K_d):
            self.move_right = False
        if key in (pygame.K_UP, pygame.K_w):
            self.move_up = False
        if key in (pygame.K_DOWN, pygame.K_s):
            self.move_down = False

    def loop(self):
        while self.running:
            dt = clock.tick(FPS) / (1000 / 60)
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    self.running = False
                elif event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_ESCAPE:
                        self.running = False
                    else:
                        self.handle_keydown(event.key)
                elif event.type == pygame.KEYUP:
                    self.handle_keyup(event.key)

            self.update()

            self.draw()

            pygame.display.flip()

        pygame.quit()
        sys.exit()


if __name__ == "__main__":
    game = Game()
    game.loop()
