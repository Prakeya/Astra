import { useState } from 'react'
import { TopBar } from '../components/Navbar'
import { useApp } from '../context/AppContext'
import { Shield, Star, Plus, Trash2, Edit2, CheckCircle, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

type Section = 'contacts' | 'zones' | 'preferences' | 'emergency'

export default function Profile() {
  const { user, updateUser } = useApp()
  const [activeSection, setActiveSection] = useState<Section | null>(null)

  // Contacts
  const [newContact, setNewContact] = useState({ name: '', phone: '', relation: 'family' })
  const [addingContact, setAddingContact] = useState(false)

  // Safe zones
  const [newZone, setNewZone] = useState({ name: '', address: '', type: 'home' as const })
  const [addingZone, setAddingZone] = useState(false)

  function addContact() {
    if (!newContact.name || !newContact.phone) return
    updateUser({
      trustedContacts: [
        ...user.trustedContacts,
        { id: Date.now().toString(), ...newContact },
      ],
    })
    setNewContact({ name: '', phone: '', relation: 'family' })
    setAddingContact(false)
  }

  function removeContact(id: string) {
    updateUser({ trustedContacts: user.trustedContacts.filter((c) => c.id !== id) })
  }

  function addZone() {
    if (!newZone.name || !newZone.address) return
    updateUser({
      safeZones: [
        ...user.safeZones,
        { id: Date.now().toString(), ...newZone },
      ],
    })
    setNewZone({ name: '', address: '', type: 'home' })
    setAddingZone(false)
  }

  function removeZone(id: string) {
    updateUser({ safeZones: user.safeZones.filter((z) => z.id !== id) })
  }

  function updatePref(key: string, value: boolean | number | string) {
    updateUser({ preferences: { ...user.preferences, [key]: value } })
  }

  const sections: { key: Section; label: string; count?: string }[] = [
    { key: 'contacts', label: 'Trusted Contacts', count: `${user.trustedContacts.length}` },
    { key: 'zones', label: 'Safe Zones', count: `${user.safeZones.length}` },
    { key: 'preferences', label: 'Alert Preferences' },
    { key: 'emergency', label: 'Emergency Settings' },
  ]

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <div
      onClick={onChange}
      className={cn(
        'w-11 h-6 rounded-full border-2 relative cursor-pointer transition-all duration-200 flex-shrink-0',
        checked ? 'bg-secondary border-secondary' : 'bg-muted border-border'
      )}
    >
      <div className={cn(
        'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200',
        checked ? 'left-5' : 'left-0.5'
      )} />
    </div>
  )

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopBar title="Profile" showBack />

      <div className="px-4 pt-4 flex flex-col gap-4">
        {/* Profile card */}
        <div className="bg-card border border-card-border rounded-3xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-black text-primary">{user.name[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-foreground">{user.name}</h2>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground">{user.phone}</p>
              <div className="flex items-center gap-1 mt-1">
                {user.verified && (
                  <span className="flex items-center gap-1 text-xs text-secondary font-medium">
                    <CheckCircle size={11} /> Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Star size={14} className="text-accent fill-accent" />
                <span className="text-sm font-bold text-foreground">{user.guardianScore}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">Score</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Shield size={14} className="text-primary" />
                <span className="text-sm font-bold text-foreground">{user.womenHelped}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">Helped</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <span className="text-sm font-bold text-foreground">{user.helpfulReports}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">Reports</div>
            </div>
          </div>

          {/* Badges */}
          {user.badges.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-4">
              {user.badges.map((b) => (
                <span key={b} className="text-xs px-2.5 py-1 bg-accent/20 text-foreground rounded-full border border-accent/30 font-medium">
                  🏆 {b}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Sections */}
        {sections.map(({ key, label, count }) => (
          <div key={key} className="bg-card border border-card-border rounded-2xl overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-4 py-4"
              onClick={() => setActiveSection(activeSection === key ? null : key)}
            >
              <span className="font-semibold text-sm text-foreground">{label}</span>
              <div className="flex items-center gap-2">
                {count && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                    {count}
                  </span>
                )}
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className={cn('text-muted-foreground transition-transform', activeSection === key && 'rotate-180')}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </button>

            {activeSection === key && (
              <div className="px-4 pb-4 border-t border-border/50">

                {/* Trusted Contacts */}
                {key === 'contacts' && (
                  <div className="pt-3 flex flex-col gap-2">
                    {user.trustedContacts.map((c) => (
                      <div key={c.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-primary">{c.name[0]}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground">{c.name}</div>
                          <div className="text-xs text-muted-foreground">{c.phone} · {c.relation}</div>
                        </div>
                        <button onClick={() => removeContact(c.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    {addingContact ? (
                      <div className="flex flex-col gap-2 p-3 bg-muted/20 rounded-xl border border-border">
                        <input
                          placeholder="Name"
                          value={newContact.name}
                          onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                          className="h-9 px-3 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <input
                          placeholder="Phone"
                          value={newContact.phone}
                          onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                          className="h-9 px-3 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <select
                          value={newContact.relation}
                          onChange={(e) => setNewContact({ ...newContact, relation: e.target.value })}
                          className="h-9 px-3 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none"
                        >
                          <option value="family">Family</option>
                          <option value="friend">Friend</option>
                          <option value="colleague">Colleague</option>
                        </select>
                        <div className="flex gap-2">
                          <button onClick={addContact} className="flex-1 py-2 text-xs font-bold bg-primary text-white rounded-lg">Add</button>
                          <button onClick={() => setAddingContact(false)} className="flex-1 py-2 text-xs font-medium border border-border rounded-lg text-foreground">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAddingContact(true)}
                        className="flex items-center gap-2 py-2.5 px-3 rounded-xl border border-dashed border-border text-xs font-medium text-muted-foreground hover:bg-muted/30 transition-all"
                      >
                        <Plus size={14} /> Add Contact
                      </button>
                    )}
                  </div>
                )}

                {/* Safe Zones */}
                {key === 'zones' && (
                  <div className="pt-3 flex flex-col gap-2">
                    {user.safeZones.map((z) => (
                      <div key={z.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                        <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                          <MapPin size={14} className="text-secondary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground">{z.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{z.address}</div>
                        </div>
                        <button onClick={() => removeZone(z.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    {addingZone ? (
                      <div className="flex flex-col gap-2 p-3 bg-muted/20 rounded-xl border border-border">
                        <input
                          placeholder="Zone name (e.g. Home)"
                          value={newZone.name}
                          onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
                          className="h-9 px-3 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <input
                          placeholder="Address"
                          value={newZone.address}
                          onChange={(e) => setNewZone({ ...newZone, address: e.target.value })}
                          className="h-9 px-3 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <div className="flex gap-2">
                          <button onClick={addZone} className="flex-1 py-2 text-xs font-bold bg-primary text-white rounded-lg">Add</button>
                          <button onClick={() => setAddingZone(false)} className="flex-1 py-2 text-xs font-medium border border-border rounded-lg text-foreground">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAddingZone(true)}
                        className="flex items-center gap-2 py-2.5 px-3 rounded-xl border border-dashed border-border text-xs font-medium text-muted-foreground hover:bg-muted/30 transition-all"
                      >
                        <Plus size={14} /> Add Safe Zone
                      </button>
                    )}
                  </div>
                )}

                {/* Preferences */}
                {key === 'preferences' && (
                  <div className="pt-3 flex flex-col gap-3">
                    {/* Guardian radius */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Guardian radius</span>
                        <span className="text-xs font-medium text-foreground">{user.preferences.guardianRadius}m</span>
                      </div>
                      <input
                        type="range" min={100} max={1000} step={100}
                        value={user.preferences.guardianRadius}
                        onChange={(e) => updatePref('guardianRadius', Number(e.target.value))}
                        className="w-full accent-primary h-2 rounded-full cursor-pointer"
                      />
                    </div>
                    {/* Voice trigger */}
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                      <span className="text-xs text-muted-foreground flex-1">Voice trigger</span>
                      <input
                        value={user.preferences.voiceTrigger}
                        onChange={(e) => updatePref('voiceTrigger', e.target.value)}
                        className="h-8 px-2 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-none w-28 text-right"
                      />
                    </div>
                    {/* Toggles */}
                    {[
                      { key: 'backgroundMode', label: 'Background mode' },
                      { key: 'silentSOS', label: 'Silent SOS' },
                    ].map(({ key: pKey, label }) => (
                      <div key={pKey} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                        <span className="text-xs text-foreground">{label}</span>
                        <Toggle
                          checked={user.preferences[pKey as keyof typeof user.preferences] as boolean}
                          onChange={() => updatePref(pKey, !user.preferences[pKey as keyof typeof user.preferences])}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Emergency Settings */}
                {key === 'emergency' && (
                  <div className="pt-3 flex flex-col gap-3">
                    {[
                      { key: 'autoCallPolice', label: 'Auto-call police' },
                      { key: 'shareWithFamily', label: 'Share with family' },
                      { key: 'deterrentAlarm', label: 'Deterrent alarm' },
                    ].map(({ key: pKey, label }) => (
                      <div key={pKey} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                        <span className="text-xs text-foreground">{label}</span>
                        <Toggle
                          checked={user.preferences[pKey as keyof typeof user.preferences] as boolean}
                          onChange={() => updatePref(pKey, !user.preferences[pKey as keyof typeof user.preferences])}
                        />
                      </div>
                    ))}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">SOS countdown (seconds)</span>
                        <span className="text-xs font-medium text-foreground">{user.preferences.sosCountdown}s</span>
                      </div>
                      <input
                        type="range" min={1} max={10}
                        value={user.preferences.sosCountdown}
                        onChange={(e) => updatePref('sosCountdown', Number(e.target.value))}
                        className="w-full accent-primary h-2 rounded-full cursor-pointer"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Check-in interval (minutes)</span>
                        <span className="text-xs font-medium text-foreground">{user.preferences.checkInInterval}m</span>
                      </div>
                      <input
                        type="range" min={1} max={30}
                        value={user.preferences.checkInInterval}
                        onChange={(e) => updatePref('checkInInterval', Number(e.target.value))}
                        className="w-full accent-primary h-2 rounded-full cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
