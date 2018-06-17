import sys

height_maxes = [5, 12, 19, 26, 33, 40, 47]

shifts = [1, 6, 7, 8]
def is_won(board):
  #check if the board won
  for num in shifts:
    m = board & (board >> num)
    if (m & m >> (num*2)):
      return True
  return False

def is_draw(board_0, board_1):
  if ((board_0 | board_1) == 279258638311359):
    return True
  else: 
    return False

def make_move(game, player, col):
  new_game = game.copy()
  new_game['board_' + str(player)] += 2**game['heights'][col]
  new_game['moves'] += 1
  new_game['pos_hist'] += str(col)
  if (new_game['heights'][col] < height_maxes[col]):
    new_game['heights'][col] += 1
  else: 
    new_game['heights'][col] = ''
  return new_game

def undo_move(game, player):
  try:
    col = int(game['pos_hist'][-1])
    new_game = game.copy()
    try: 
      new_game['board_' + str(player)] -= 2**(game['heights'][col] - 1)
      new_game['heights'][col] -= 1
    except TypeError:
      new_game['board_' + str(player)] -= 2**(height_maxes[col])
      new_game['heights'][col] = height_maxes[col]
    new_game['moves'] -= 1
    new_game['pos_hist'] = game['pos_hist'][0:-1]
    return new_game
  except IndexError:
    print(game)



def calc_score(game):
  return (42 - game['moves'])
  
# set up variables
# arg1 = int(sys.argv[1])
# arg2 = int(sys.argv[2])
# arg3Temp = sys.argv[3].split(',')
# arg4 = int(sys.argv[4])
# arg3 = []
# for num in arg3Temp:
#   arg3.append(int(num))

# arg1 = 4502306619525
# arg2 = 138269737226
arg1 = 93804814454026
arg2 = 185445233394309
arg3 = [ 4, 12, 19, '', 33, '', '' ]
arg4 = 37
arg5 = ''

indices = range(7)

# game
game = {
  'board_0': arg1,
  'board_1': arg2,
  'heights': arg3,
  'moves': arg4,
  'pos_hist': arg5,
}

its_var = 0
def check_solutions(game, its):
  scores = [0,0,0,0,0,0,0]
  its += 1
  for num in indices:
    print (game)
    try: 
      new_game = make_move(game, game['moves'] & 1, num).copy()
      if (is_won(new_game['board_' + str(game['moves'] & 1)]) or is_draw(new_game['board_0'], new_game['board_1'])):
        scores[num] = calc_score(new_game)
        game = undo_move(game, str(game['moves'] & 1))

      else:
        scores[num] = max(check_solutions(new_game, its))
      
    except TypeError:
      2+2
  game = undo_move(game, str(game['moves'] & 1))
  return scores
    



print(game)
print(check_solutions(game, its_var))
# try: 
#   make_move(game, game['moves'] & 1 , 2)
#   print(game)
# except TypeError:
#   print(game)
# # print(game)


# print(is_draw(game['board_0'], game['board_1']))


test = arg1 & arg2



one = is_won(game['board_1'])
two = is_won(arg2)


# print(game)
sys.stdout.flush()