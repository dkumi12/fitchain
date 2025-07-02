            <div className="flex gap-4 flex-col items-center">
              <div className="relative">
                <AvatarDisplay
                  avatarId={selectedAvatar}
                  size="xl"
                  userData={displayData}
                  showFrame={true}
                  onClick={() => setShowAvatarSelector(true)}
                  className="cursor-pointer hover:scale-105 transition-transform"
                />
                <button
                  onClick={() => setShowAvatarSelector(true)}
                  className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 rounded-full p-2 transition-colors shadow-lg"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
              <div className="text-center">
                <h1 className="text-white text-2xl font-bold">{address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'User'}</h1>
                <p className="text-gray-400 text-sm mt-1">FitChain Athlete</p>
              </div>
            </div>

            {/* Avatar Collection */}
            <div className="w-full bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Avatar Collection</h3>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Unlocked</span>
                  <span>{available.length} / {fitnessAvatars.default.length + fitnessAvatars.unlockable.length}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(available.length / (fitnessAvatars.default.length + fitnessAvatars.unlockable.length)) * 100}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-5 gap-3">
                {[...fitnessAvatars.default, ...fitnessAvatars.unlockable].slice(0, 10).map(avatar => {
                  const isUnlocked = available.some(a => a.id === avatar.id);
                  const isCurrent = avatar.id === selectedAvatar;
                  
                  return (
                    <div
                      key={avatar.id}
                      className={`relative ${isUnlocked ? 'cursor-pointer' : ''}`}
                      onClick={() => isUnlocked && setShowAvatarSelector(true)}
                    >
                      <AvatarDisplay
                        avatarId={avatar.id}
                        size="sm"
                        userData={displayData}
                        showFrame={false}
                        isLocked={!isUnlocked}
                      />
                      {isCurrent && (
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {[...fitnessAvatars.default, ...fitnessAvatars.unlockable].length > 10 && (
                  <button
                    onClick={() => setShowAvatarSelector(true)}
                    className="bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
                  >
                    <span className="text-gray-400 text-sm">+{[...fitnessAvatars.default, ...fitnessAvatars.unlockable].length - 10}</span>
                  </button>
                )}
              </div>
              
              <button
                onClick={() => setShowAvatarSelector(true)}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                View All Avatars
              </button>
            </div>